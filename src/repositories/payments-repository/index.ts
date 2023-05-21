import Stripe from 'stripe';
import { prisma } from '@/config';
import { PaymentParams } from '@/protocols';

const stripe = new Stripe(process.env.STRIPE_KEY, {
  apiVersion: '2022-11-15',
});

async function findPaymentByTicketId(ticketId: number) {
  return prisma.payment.findFirst({
    where: {
      ticketId,
    },
  });
}

async function createPayment(ticketId: number, params: PaymentParams) {
  return prisma.payment.create({
    data: {
      ticketId,
      ...params,
    },
  });
}

async function createPaymentData(userId: number, sessionId: string) {
  await prisma.paymentData.upsert({
    where: {
      userId: userId,
    },
    create: {
      userId: userId,
      url: sessionId,
    },
    update: {
      url: sessionId,
    },
  });
}

async function verifyPaymentData(userId: number, ticketId: number) {
  const payment = await prisma.paymentData.findFirst({
    where: {
      userId: userId,
    },
  });

  if (!payment) {
    return false;
  }

  const event = await stripe.checkout.sessions.retrieve(payment.url);
  if (event.payment_status === 'paid') {
    await prisma.ticket.update({
      where: {
        id: ticketId,
      },
      data: {
        status: 'PAID',
      },
    });
    return true;
  } else {
    return false;
  }
}

export default { findPaymentByTicketId, createPayment, createPaymentData, verifyPaymentData };

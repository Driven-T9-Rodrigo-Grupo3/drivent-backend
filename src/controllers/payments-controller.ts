import { Response } from 'express';
import httpStatus from 'http-status';
import { AuthenticatedRequest } from '@/middlewares';
import paymentsService from '@/services/payments-service';

export async function getPaymentByTicketId(req: AuthenticatedRequest, res: Response) {
  try {
    const ticketId = Number(req.query.ticketId);
    const { userId } = req;

    if (!ticketId) return res.sendStatus(httpStatus.BAD_REQUEST);

    const payment = await paymentsService.getPaymentByTicketId(userId, ticketId);
    if (!payment) return res.sendStatus(httpStatus.NOT_FOUND);

    return res.status(httpStatus.OK).send(payment);
  } catch (error) {
    if (error.name === 'UnauthorizedError') {
      return res.sendStatus(httpStatus.UNAUTHORIZED);
    }
    return res.sendStatus(httpStatus.NOT_FOUND);
  }
}

export async function paymentProcess(req: AuthenticatedRequest, res: Response) {
  const { userId } = req;
  const { ticketId, cardData } = req.body;

  try {
    if (!ticketId || !cardData) return res.sendStatus(httpStatus.BAD_REQUEST);

    const payment = await paymentsService.paymentProcess(ticketId, userId, cardData);
    if (!payment) return res.sendStatus(httpStatus.NOT_FOUND);

    return res.status(httpStatus.OK).send(payment);
  } catch (error) {
    if (error.name === 'UnauthorizedError') {
      return res.sendStatus(httpStatus.UNAUTHORIZED);
    }
    return res.sendStatus(httpStatus.NOT_FOUND);
  }
}

export async function stripePayment(req: AuthenticatedRequest, res: Response) {
  const { userId } = req;
  try {
    const sessionUrl = await paymentsService.stripePayment(userId);
    res.send(sessionUrl).status(200);
  } catch (error) {
    if (error.name === 'RequestError') {
      res.sendStatus(500);
    }
  }
}

export async function paymentVerification(req: AuthenticatedRequest, res: Response) {
  const { userId } = req;
  try {
    if (!userId) {
      return res.sendStatus(httpStatus.BAD_REQUEST);
    }
    const paidStatus = await paymentsService.verifyUserPayment(userId);
    return res.status(httpStatus.OK).send({ paid: paidStatus });
  } catch (error) {
    return res.sendStatus(httpStatus.BAD_REQUEST);
  }
}

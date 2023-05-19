import { Ticket, TicketStatus, TicketType } from '@prisma/client';
import { prisma, redis } from '@/config';
import { CreateTicketParams } from '@/protocols';

const cacheTypesKey = 'ticketsType';

async function findTicketTypes(): Promise<TicketType[]> {
  const cachedTicketTypes = await redis.get(cacheTypesKey);

  if (cachedTicketTypes) {
    const ticketTypes = JSON.parse(cachedTicketTypes);
    return ticketTypes;
  }

  const ticketTypes = prisma.ticketType.findMany();

  redis.set(cacheTypesKey, JSON.stringify(ticketTypes));

  return ticketTypes;
}

async function findTicketByEnrollmentId(enrollmentId: number): Promise<
  Ticket & {
    TicketType: TicketType;
  }
> {
  return prisma.ticket.findFirst({
    where: { enrollmentId },
    include: {
      TicketType: true, //join
    },
  });
}

async function createTicket(ticket: CreateTicketParams) {
  return prisma.ticket.create({
    data: ticket,
  });
}

async function findTickeyById(ticketId: number) {
  return prisma.ticket.findFirst({
    where: {
      id: ticketId,
    },
    include: {
      Enrollment: true,
    },
  });
}

async function findTickeWithTypeById(ticketId: number) {
  return prisma.ticket.findFirst({
    where: {
      id: ticketId,
    },
    include: {
      TicketType: true,
    },
  });
}

async function ticketProcessPayment(ticketId: number) {
  return prisma.ticket.update({
    where: {
      id: ticketId,
    },
    data: {
      status: TicketStatus.PAID,
    },
  });
}

export default {
  findTicketTypes,
  findTicketByEnrollmentId,
  createTicket,
  findTickeyById,
  findTickeWithTypeById,
  ticketProcessPayment,
};

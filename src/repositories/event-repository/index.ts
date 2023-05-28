import { prisma } from '@/config';

async function findFirst() {
  const event = await prisma.event.findFirst();

  return event;
}

const eventRepository = {
  findFirst,
};

export default eventRepository;

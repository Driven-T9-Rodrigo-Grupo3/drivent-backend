import { prisma, redis } from '@/config';

const cacheKey = 'events';

async function findFirst() {
  const cachedEvent = await redis.get(cacheKey);

  if (cachedEvent) {
    const hotels = JSON.parse(cachedEvent);
    return hotels;
  }

  const event = prisma.event.findFirst();

  redis.set(cacheKey, JSON.stringify(event));

  return event;
}

const eventRepository = {
  findFirst,
};

export default eventRepository;

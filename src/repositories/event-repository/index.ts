import { prisma, redis } from '@/config';

const cacheKey = 'events';

async function findFirst() {
  const cachedEvent = await redis.get(cacheKey);

  if (cachedEvent) return JSON.parse(cachedEvent);

  const event = await prisma.event.findFirst();

  redis.set(cacheKey, JSON.stringify(event));

  return event;
}

const eventRepository = {
  findFirst,
};

export default eventRepository;

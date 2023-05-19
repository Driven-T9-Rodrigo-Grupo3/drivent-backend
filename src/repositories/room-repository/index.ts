import { prisma, redis } from '@/config';

const cacheKey = 'rooms';

async function findAllByHotelId(hotelId: number) {
  const cachedRooms = await redis.get(cacheKey);

  if (cachedRooms) {
    const hotels = JSON.parse(cachedRooms);
    return hotels;
  }

  const rooms = prisma.room.findMany({
    where: {
      hotelId,
    },
  });

  redis.set(cacheKey, JSON.stringify(rooms));

  return rooms;
}

async function findById(roomId: number) {
  return prisma.room.findFirst({
    where: {
      id: roomId,
    },
  });
}

const roomRepository = {
  findAllByHotelId,
  findById,
};

export default roomRepository;

import { prisma, redis } from '@/config';

const cacheKey = 'hotels';

async function findHotels() {
  const cachedHotels = await redis.get(cacheKey);

  if (cachedHotels) {
    const hotels = JSON.parse(cachedHotels);
    return hotels;
  }

  const hotels = prisma.hotel.findMany();

  redis.set(cacheKey, JSON.stringify(hotels));

  return hotels;
}

async function findRoomsByHotelId(hotelId: number) {
  return prisma.hotel.findFirst({
    where: {
      id: hotelId,
    },
    include: {
      Rooms: true,
    },
  });
}

const hotelRepository = {
  findHotels,
  findRoomsByHotelId,
};

export default hotelRepository;

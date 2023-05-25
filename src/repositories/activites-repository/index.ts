import { ActivityBoooking } from '@prisma/client';
import { prisma } from '@/config';

type CreateParams = Omit<ActivityBoooking, 'id' | 'createdAt' | 'updatedAt'>;

async function findActivities() {
  return prisma.activity.findMany();
}

async function createBooking({ activityId, userId }: CreateParams): Promise<ActivityBoooking> {
  return prisma.activityBoooking.create({
    data: {
      activityId,
      userId,
    },
  });
}

async function findById(activityId: number) {
  return prisma.activity.findFirst({
    where: {
      id: activityId,
    },
  });
}

async function findByActivityBookingId(activityBookingId: number) {
  return prisma.activityBoooking.findMany({
    where: {
      id: activityBookingId,
    },
  });
}

const activitiesRepository = {
  findActivities,
  findById,
  findByActivityBookingId,
  createBooking,
};

export default activitiesRepository;

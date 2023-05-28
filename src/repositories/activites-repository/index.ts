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

async function findUserBookingActivity(userId: number, activityId: number) {
  return prisma.activityBoooking.findFirst({
    where: {
      userId,
      activityId,
    },
  });
}

async function findByActivitiesBookingId(activityId: number) {
  return prisma.activityBoooking.findMany({
    where: {
      activityId,
    },
  });
}

const activitiesRepository = {
  findActivities,
  findById,
  findUserBookingActivity,
  findByActivitiesBookingId,
  createBooking,
};

export default activitiesRepository;

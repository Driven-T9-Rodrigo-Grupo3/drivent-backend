import { ActivityBooking } from '@prisma/client';
import { prisma } from '@/config';

type CreateParams = Omit<ActivityBooking, 'id' | 'createdAt' | 'updatedAt'>;

async function findActivities() {
  return prisma.activity.findMany();
}

async function createBooking({ activityId, userId }: CreateParams): Promise<ActivityBooking> {
  return prisma.activityBooking.create({
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
  return prisma.activityBooking.findFirst({
    where: {
      userId,
      activityId,
    },
  });
}

async function findByActivitiesBookingId(activityId: number) {
  return prisma.activityBooking.findMany({
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

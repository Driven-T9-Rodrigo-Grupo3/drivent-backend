import { Activity, ActivityBoooking, ActivityLocation } from '@prisma/client';
import faker from '@faker-js/faker';
import { prisma } from '@/config';

type CreateActivityBoookingParams = Omit<ActivityBoooking, 'id' | 'createdAt' | 'updatedAt'>;

function randomLocation(): ActivityLocation {
  const locationsOptions: ActivityLocation[] = ['MAIN', 'SIDE', 'WORKSHOP'];

  const randomIndex = Math.floor(Math.random() * locationsOptions.length);
  return locationsOptions[randomIndex];
}

export function createActivity(location?: ActivityLocation, capacityTotal?: number) {
  const validLocation = location || randomLocation();

  if (!['MAIN', 'SIDE', 'WORKSHOP'].includes(validLocation)) {
    throw new Error(`Invalid activity location: ${validLocation}`);
  }

  return prisma.activity.create({
    data: {
      name: faker.name.findName(),
      capacity: capacityTotal || faker.datatype.number({ min: 10, max: 28 }),
      dateTime: faker.date.future(),
      hoursDuration: 1,
      location: validLocation,
    },
  });
}

export function createActivityBooking(activityId: number, userId: number) {
  return prisma.activityBoooking.create({
    data: {
      activityId,
      userId,
    },
  });
}

import { Activity, ActivityBooking, ActivityLocation } from '@prisma/client';
import faker from '@faker-js/faker';
import { prisma } from '@/config';

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
      hoursDuration: faker.datatype.number({ min: 1, max: 4 }),
      location: validLocation,
    },
  });
}

export function createActivityBooking(activityId: number, userId: number) {
  return prisma.activityBooking.create({
    data: {
      activityId,
      userId,
    },
  });
}

export function getActivityMock() {
  const expect: Activity[] = [
    {
      id: 1,
      name: 'Teste',
      capacity: 27,
      location: 'MAIN',
      dateTime: new Date(),
      hoursDuration: 2,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];

  return expect;
}

export function getActivityBoookingMock(activityId: number) {
  const expect: ActivityBooking[] = [
    {
      id: 1,
      userId: 1,
      activityId: activityId,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];

  return expect;
}

export function getBookingActivity() {
  const bookingAcivity: ActivityBooking[] = [
    {
      id: 1,
      userId: 1,
      activityId: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];
  return bookingAcivity;
}

export function getBookingActivityReturn() {
  const bookingAcivity: ActivityBooking = {
    id: 1,
    userId: 1,
    activityId: 1,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  return bookingAcivity;
}

export function findActivityByIdReturn() {
  const expected: Activity = {
    id: 1,
    name: 'Teste',
    capacity: 27,
    location: 'MAIN',
    dateTime: new Date(),
    hoursDuration: 2,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  return expected;
}

export function findActivityIdReturn() {
  const expected: Activity = {
    id: 1,
    name: 'Teste',
    capacity: 27,
    location: 'MAIN',
    dateTime: new Date(),
    hoursDuration: 2,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  return expected;
}

export function findBookingByActivityIdReturn() {
  const expected: ActivityBooking[] = [
    {
      id: 1,
      userId: 1,
      activityId: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];

  return expected;
}

export function findBookingByActivityIdNoCapacityReturn() {
  const expected: Activity = {
    id: 1,
    name: 'Teste',
    capacity: 1,
    location: 'MAIN',
    dateTime: new Date(),
    hoursDuration: 1,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  return expected;
}

export function findActivityByIdNoCapacityReturn() {
  const expected: ActivityBooking[] = [
    {
      id: 1,
      userId: 1,
      activityId: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];

  return expected;
}

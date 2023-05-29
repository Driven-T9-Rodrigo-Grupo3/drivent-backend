import {
  enrollmentWithAddressReturn,
  findTicketByEnrollmentIdReturn,
  findTicketFailByEnrollmentIdReturn,
} from '../factories';
import activitesService from '../../src/services/activities-service';
import {
  findActivityByIdNoCapacityReturn,
  findActivityByIdReturn,
  findActivityIdReturn,
  findBookingByActivityIdNoCapacityReturn,
  findBookingByActivityIdReturn,
  getActivityBoookingMock,
  getActivityMock,
  getBookingActivity,
  getBookingActivityReturn,
} from '../factories/activities-factory';
import { CannotActivityBookingError } from '@/errors/cannot-activity-booking-error';
import enrollmentRepository from '@/repositories/enrollment-repository';
import { cannotListActivitiesError } from '@/errors/cannot-list-activities-error';
import activitesRepository from '@/repositories/activites-repository';
import ticketsRepository from '@/repositories/tickets-repository';
import { notFoundError } from '@/errors';

describe('listActivities function', () => {
  it('should return not found error', async () => {
    const userId = 1;

    jest.spyOn(enrollmentRepository, 'findWithAddressByUserId').mockResolvedValue(null);

    await expect(activitesService.listActivities(userId)).rejects.toEqual(notFoundError());
  });

  it('should return cannot list activities error with ticket null', async () => {
    const userId = 1;

    jest.spyOn(enrollmentRepository, 'findWithAddressByUserId').mockResolvedValue(enrollmentWithAddressReturn());
    jest.spyOn(ticketsRepository, 'findTicketByEnrollmentId').mockResolvedValue(null);

    await expect(activitesService.listActivities(userId)).rejects.toEqual(cannotListActivitiesError());
  });

  it('should return cannot list activities error with ticket status reserved', async () => {
    const userId = 1;

    jest.spyOn(enrollmentRepository, 'findWithAddressByUserId').mockResolvedValue(enrollmentWithAddressReturn());
    jest.spyOn(ticketsRepository, 'findTicketByEnrollmentId').mockResolvedValue(findTicketFailByEnrollmentIdReturn());

    await expect(activitesService.listActivities(userId)).rejects.toEqual(cannotListActivitiesError());
  });
});

describe('checkEnrollmentTicket function', () => {
  it('should return error in find enrollment', async () => {
    const userId = 1;
    const activityId = 1;

    jest.spyOn(activitesService, 'checkEnrollmentTicket').mockResolvedValue(undefined);
    jest.spyOn(enrollmentRepository, 'findWithAddressByUserId').mockResolvedValue(null);

    await expect(activitesService.bookingActivity(userId, activityId)).rejects.toEqual(CannotActivityBookingError());
    expect(enrollmentRepository.findWithAddressByUserId).toHaveBeenCalledWith(userId);
  });

  it('should return error in find ticket', async () => {
    const userId = 1;
    const activityId = 1;

    jest.spyOn(activitesService, 'checkEnrollmentTicket').mockResolvedValue(undefined);
    jest.spyOn(enrollmentRepository, 'findWithAddressByUserId').mockResolvedValue(enrollmentWithAddressReturn());
    jest.spyOn(ticketsRepository, 'findTicketByEnrollmentId').mockResolvedValue(null);

    await expect(activitesService.bookingActivity(userId, activityId)).rejects.toEqual(CannotActivityBookingError());
    expect(ticketsRepository.findTicketByEnrollmentId).toHaveBeenCalledWith(userId);
  });
});

describe('checkValidBooking function', () => {
  it('should return error in find activity by id', async () => {
    const activityId = 1;

    jest.spyOn(activitesRepository, 'findByActivitiesBookingId').mockResolvedValue(null);
    jest.spyOn(activitesRepository, 'findById').mockResolvedValue(findActivityIdReturn());

    await expect(activitesService.checkValidBooking(activityId)).rejects.toEqual(notFoundError());
  });

  it('should return error in fin booking by activity Id', async () => {
    const activityId = 1;

    jest.spyOn(activitesRepository, 'findByActivitiesBookingId').mockResolvedValue(findActivityByIdNoCapacityReturn());
    jest.spyOn(activitesRepository, 'findById').mockResolvedValue(findBookingByActivityIdNoCapacityReturn());

    await expect(activitesService.checkValidBooking(activityId)).rejects.toEqual(CannotActivityBookingError());
  });
});

describe('getActivities function', () => {
  it('should get activities', async () => {
    const userId = 1;
    const activities = getActivityMock();

    jest.spyOn(activitesService, 'listActivities').mockResolvedValue(null);
    jest.spyOn(enrollmentRepository, 'findWithAddressByUserId').mockResolvedValue(enrollmentWithAddressReturn());
    jest.spyOn(ticketsRepository, 'findTicketByEnrollmentId').mockResolvedValue(findTicketByEnrollmentIdReturn());

    jest.spyOn(activitesRepository, 'findActivities').mockResolvedValue(activities);

    const result = await activitesService.getActivities(userId);

    expect(result).toEqual(activities);
  });
});

describe('bookingActivity function', () => {
  it('should create a booking for the given user and activity', async () => {
    const userId = 1;
    const activityId = 1;
    const booking = getBookingActivityReturn();

    jest.spyOn(activitesService, 'checkEnrollmentTicket').mockResolvedValue(undefined);
    jest.spyOn(enrollmentRepository, 'findWithAddressByUserId').mockResolvedValue(enrollmentWithAddressReturn());
    jest.spyOn(ticketsRepository, 'findTicketByEnrollmentId').mockResolvedValue(findTicketByEnrollmentIdReturn());

    jest.spyOn(activitesService, 'checkValidBooking').mockResolvedValue(undefined);
    jest.spyOn(activitesRepository, 'findById').mockResolvedValue(findActivityByIdReturn());
    jest.spyOn(activitesRepository, 'findByActivitiesBookingId').mockResolvedValue(findBookingByActivityIdReturn());

    jest.spyOn(activitesRepository, 'createBooking').mockResolvedValue(booking);

    const result = await activitesService.bookingActivity(userId, activityId);

    expect(activitesRepository.createBooking).toHaveBeenCalledWith({ activityId, userId });
    expect(result).toEqual(booking);
  });
});

describe('getUserBookingActivity function', () => {
  it('should return the booking for the given user id', async () => {
    const userId = 1;
    const activityId = 1;
    const booking = getBookingActivity();

    jest.spyOn(activitesRepository, 'findByActivitiesBookingId').mockResolvedValue(booking);

    const result = await activitesService.getUserBookingActivity(userId, activityId);

    expect(activitesRepository.findUserBookingActivity).toHaveBeenCalledWith(userId, activityId);
    expect(result).toEqual(booking);
  });
});

describe('getBookingsFromActivity function', () => {
  it('should get booking from activity', async () => {
    const userId = 1;
    const activities = getActivityMock();
    const activitieBookings = getActivityBoookingMock(activities[0].id);

    jest.spyOn(activitesService, 'listActivities').mockResolvedValue(null);
    jest.spyOn(enrollmentRepository, 'findWithAddressByUserId').mockResolvedValue(enrollmentWithAddressReturn());
    jest.spyOn(ticketsRepository, 'findTicketByEnrollmentId').mockResolvedValue(findTicketByEnrollmentIdReturn());

    jest.spyOn(activitesRepository, 'findByActivitiesBookingId').mockResolvedValue(activitieBookings);

    const result = await activitesService.getActivities(userId);

    expect(result).toEqual(activities);
  });
});

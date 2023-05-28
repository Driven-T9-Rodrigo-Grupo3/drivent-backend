import { notFoundError } from '@/errors';
import { badRequestError } from '@/errors/bad-request-error';
import { cannotBookingError } from '@/errors/cannot-booking-error';
import activitiesRepository from '@/repositories/activites-repository';
import enrollmentRepository from '@/repositories/enrollment-repository';
import ticketsRepository from '@/repositories/tickets-repository';

async function checkEnrollmentTicket(userId: number) {
  const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);
  if (!enrollment) throw cannotBookingError();

  const ticket = await ticketsRepository.findTicketByEnrollmentId(enrollment.id);

  if (!ticket || ticket.status === 'RESERVED' || ticket.TicketType.isRemote || !ticket.TicketType.includesHotel) {
    throw cannotBookingError();
  }
}

async function checkValidBooking(activityId: number) {
  const activity = await activitiesRepository.findById(activityId);
  const bookings = await activitiesRepository.findByActivitiesBookingId(activityId);

  if (!activity) throw notFoundError();
  if (activity.capacity <= bookings.length) throw cannotBookingError();
}

async function getActivities() {
  const activities = await activitiesRepository.findActivities();

  if (!activities || activities.length === 0) {
    throw notFoundError();
  }

  return activities;
}

async function bookingActivity(userId: number, activityId: number) {
  if (!activityId) throw badRequestError();

  await checkEnrollmentTicket(userId);
  await checkValidBooking(activityId);

  return activitiesRepository.createBooking({ activityId, userId });
}

async function getUserBookingActivity(userId: number, activityId: number) {
  const booking = await activitiesRepository.findUserBookingActivity(userId, activityId);
  if (!booking) throw notFoundError();

  return booking;
}

async function getBookingsFromActivity(activityId: number) {
  const bookings = await activitiesRepository.findByActivitiesBookingId(activityId);

  if (!bookings || bookings.length === 0) {
    throw notFoundError();
  }

  return bookings;
}

const activitiesService = {
  getActivities,
  getBookingsFromActivity,
  getUserBookingActivity,
  bookingActivity,
};

export default activitiesService;

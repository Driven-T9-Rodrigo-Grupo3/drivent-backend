import { notFoundError } from '@/errors';
import { badRequestError } from '@/errors/bad-request-error';
import { CannotActivityBookingError } from '@/errors/cannot-activity-booking-error';
import { cannotListActivitiesError } from '@/errors/cannot-list-activities-error';
import activitiesRepository from '@/repositories/activites-repository';
import enrollmentRepository from '@/repositories/enrollment-repository';
import ticketsRepository from '@/repositories/tickets-repository';

async function listActivities(userId: number) {
  const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);
  if (!enrollment) {
    throw notFoundError();
  }
  const ticket = await ticketsRepository.findTicketByEnrollmentId(enrollment.id);

  if (!ticket || ticket.status === 'RESERVED') {
    throw cannotListActivitiesError();
  }
}

async function checkEnrollmentTicket(userId: number) {
  const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);
  if (!enrollment) throw CannotActivityBookingError();

  const ticket = await ticketsRepository.findTicketByEnrollmentId(enrollment.id);

  if (!ticket || ticket.status === 'RESERVED' || ticket.TicketType.isRemote || !ticket.TicketType.includesHotel) {
    throw CannotActivityBookingError();
  }
}

async function checkValidBooking(activityId: number) {
  const activity = await activitiesRepository.findById(activityId);
  const bookings = await activitiesRepository.findByActivitiesBookingId(activityId);

  if (!activity) throw notFoundError();
  if (activity.capacity <= bookings.length) throw CannotActivityBookingError();
}

async function getActivities(userId: number) {
  await listActivities(userId);

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
  const activite = await activitiesRepository.findById(activityId);
  if (!activite) throw notFoundError();

  const booking = await activitiesRepository.findUserBookingActivity(userId, activityId);

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
  listActivities,
  checkEnrollmentTicket,
  checkValidBooking,
  getActivities,
  getBookingsFromActivity,
  getUserBookingActivity,
  bookingActivity,
};

export default activitiesService;

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

  return activities;
}

async function bookingActivity(userId: number, activityId: number) {
  if (!activityId) throw badRequestError();

  await checkEnrollmentTicket(userId);
  await checkValidBooking(activityId);

  return activitiesRepository.createBooking({ activityId, userId });
}

async function getBooking(userId: number) {
  const booking = await activitiesRepository.findByActivityBooking(userId);

  return booking;
}

async function getBookingsFromActivity(activityId: number) {
  const bookings = await activitiesRepository.findByActivitiesBookingId(activityId);

  return bookings;
}

const activitiesService = {
  getActivities,
  getBookingsFromActivity,
  getBooking,
  bookingActivity,
};

export default activitiesService;

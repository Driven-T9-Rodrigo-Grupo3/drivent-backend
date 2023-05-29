import { Router } from 'express';
import { authenticateToken } from '@/middlewares';
import { getActivites, getUserBookingActivity, getBookingsFromActivity, bookingActivity } from '@/controllers';

const activitiesRouter = Router();

activitiesRouter
  .all('/*', authenticateToken)
  .get('/', getActivites)
  .get('/:activityId/user', getUserBookingActivity)
  .get('/:activityId', getBookingsFromActivity)
  .post('/', bookingActivity);

export { activitiesRouter };

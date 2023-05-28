import { Router } from 'express';
import { authenticateToken } from '@/middlewares';
import { getActivites, getBooking, getBookingsFromActivity, bookingActivity } from '@/controllers';

const activitesRouter = Router();

activitesRouter
  .all('/*', authenticateToken)
  .get('/', getActivites)
  .get('/user', getBooking)
  .get('/:activityId', getBookingsFromActivity)
  .post('/', bookingActivity);

export { activitesRouter };

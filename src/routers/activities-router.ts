import { Router } from 'express';
import { authenticateToken } from '@/middlewares';
import { getActivites, bookingActivity } from '@/controllers';

const activitesRouter = Router();

activitesRouter.all('/*', authenticateToken).get('', getActivites).post('', bookingActivity);

export { activitesRouter };

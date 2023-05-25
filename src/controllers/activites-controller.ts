import { NextFunction, Response } from 'express';
import httpStatus from 'http-status';

import { AuthenticatedRequest } from '@/middlewares';
import activitiesService from '@/services/activities-service';

export async function getActivites(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const activities = await activitiesService.getActivities();
    return res.status(httpStatus.OK).send(activities);
  } catch (error) {
    next(error);
  }
}

export async function bookingActivity(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const { userId } = req;
    const { activityId } = req.body as Record<string, number>;

    const activity = await activitiesService.bookingActivity(userId, activityId);

    return res.status(httpStatus.OK).send({
      activityId: activity.id,
    });
  } catch (error) {
    next(error);
  }
}

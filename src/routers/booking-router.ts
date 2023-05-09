import { Router } from 'express';
import { authenticateToken } from '@/middlewares';
import { bookingRoom, changeBooking, listBooking } from '@/controllers';

const bookingRouter = Router();

bookingRouter.all('/*', authenticateToken).get('', listBooking).post('', bookingRoom).put('/:bookingId', changeBooking);

export { bookingRouter };

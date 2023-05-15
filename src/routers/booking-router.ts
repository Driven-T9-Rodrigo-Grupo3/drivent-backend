import { Router } from 'express';
import { authenticateToken } from '@/middlewares';
import { bookingRoom, changeBooking, listBooking, listBookingByRoom } from '@/controllers';

const bookingRouter = Router();

bookingRouter
  .all('/*', authenticateToken)
  .get('', listBooking)
  .get('/:roomId', listBookingByRoom)
  .post('', bookingRoom)
  .put('/:bookingId', changeBooking);

export { bookingRouter };

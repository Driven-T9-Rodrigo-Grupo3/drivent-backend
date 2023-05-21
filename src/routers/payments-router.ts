import { Router } from 'express';
import { authenticateToken } from '@/middlewares';
import { getPaymentByTicketId, paymentProcess, stripePayment, paymentVerification } from '@/controllers';

const paymentsRouter = Router();

paymentsRouter
  .all('/*', authenticateToken)
  .get('/', getPaymentByTicketId)
  .post('/process', paymentProcess)
  .post('/create-checkout-session', stripePayment)
  .get('/verify', paymentVerification);

export { paymentsRouter };

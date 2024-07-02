import { Router } from 'express';
import auth from '../../middlewares/auth';
import { ENUM_USER_ROLE } from '../../../enums/user';
import { PaymentController } from './payment.controller';

const router = Router();

router.post(
  '/payment-intent',
  auth(ENUM_USER_ROLE.USER),
  PaymentController.makePaymentIntent,
);

export const PaymentRoutes = router;

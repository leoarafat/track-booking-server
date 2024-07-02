import { Router } from 'express';
import { ENUM_USER_ROLE } from '../../../enums/user';
import auth from '../../middlewares/auth';
import { validateRequest } from '../../middlewares/validateRequest';
import { SubscriptionController } from './subscriptions.controller';
import { SubscriptionsValidation } from './subscriptions.validation';

const router = Router();

router.post(
  '/upgrade-plan',
  auth(ENUM_USER_ROLE.USER),
  validateRequest(SubscriptionsValidation.post),
  SubscriptionController.upgradeSubscription,
);

router.get(
  '/my-plan',
  auth(ENUM_USER_ROLE.USER),
  SubscriptionController.mySubscription,
);

export const SubscriptionRoutes = router;

import express from 'express';
import { ENUM_USER_ROLE } from '../../../enums/user';
import auth from '../../middlewares/auth';
import { validateRequest } from '../../middlewares/validateRequest';
import { SubscriptionPlanValidation } from './subscription-plan.validation';
import { SubscriptionsPlanController } from './subscriptions-plan.controller';
const router = express.Router();

router
  .route('/:id')
  .patch(
    auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN),
    validateRequest(SubscriptionPlanValidation.updateSubscriptionPlanZodSchema),
    SubscriptionsPlanController.updateSubscriptionPlan,
  );

router
  .route('/')
  .get(
    auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.USER),
    SubscriptionsPlanController.getAllSubscriptionPlan,
  )
  .post(
    auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN),
    validateRequest(SubscriptionPlanValidation.CreateSubscriptionPlanZodSchema),
    SubscriptionsPlanController.createSubscriptionPlan,
  );

export const SubscriptionPlanRoutes = router;

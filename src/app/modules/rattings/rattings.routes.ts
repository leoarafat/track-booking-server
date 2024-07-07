import { Router } from 'express';
import auth from '../../middlewares/auth';
import { ENUM_USER_ROLE } from '../../../enums/user';
import { RattingValidation } from './ratting.validation';
import { validateRequest } from '../../middlewares/validateRequest';
import { RattingController } from './rattings.controller';

const router = Router();
router.post(
  '/send',
  auth(ENUM_USER_ROLE.USER),
  validateRequest(RattingValidation.create),
  RattingController.insertIntoDB,
);
export const RattingRoutes = router;

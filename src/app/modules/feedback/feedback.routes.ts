import express from 'express';
import { FeedbackController } from './feedback.controller';
import auth from '../../middlewares/auth';
import { ENUM_USER_ROLE } from '../../../enums/user';

const router = express.Router();
router.post('/send', FeedbackController.sendFeedBack);
router.get(
  '/all',
  auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN),
  FeedbackController.getFeedback,
);
router.post('/reply/:id', FeedbackController.addReplyToFeedback);
export const FeedbackRoutes = router;

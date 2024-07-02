import express from 'express';
import { NotificationController } from './notifications.controller';
import auth from '../../middlewares/auth';
import { ENUM_USER_ROLE } from '../../../enums/user';

const router = express.Router();

router.get(
  '/get-all-notifications',
  auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN),
  NotificationController.getNotifications,
);
router.get(
  '/my-notifications',
  auth(ENUM_USER_ROLE.USER),
  NotificationController.myNotification,
);
router.patch(
  '/update-notification',
  auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.USER, ENUM_USER_ROLE.SUPER_ADMIN),
  NotificationController.updateAll,
);
router.patch(
  '/update-notification/:id',
  auth(ENUM_USER_ROLE.USER),
  NotificationController.updateNotification,
);

export const NotificationRoutes = router;

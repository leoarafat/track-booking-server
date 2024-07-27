import { Router } from 'express';
import { DriverController } from './driver.controller';
import { validateRequest } from '../../middlewares/validateRequest';
import auth from '../../middlewares/auth';
import { ENUM_USER_ROLE } from '../../../enums/user';

import { uploadFile } from '../../middlewares/fileUploader';
import { DriverValidation } from './driverValidation';

const router = Router();

router.post(
  '/register',
  uploadFile(),
  validateRequest(DriverValidation.createDriverSchema),
  DriverController.registerDriver,
);
router.post('/activate-driver', DriverController.activateDriver);
router.post(
  '/login',
  validateRequest(DriverValidation.loginDriverSchema),
  DriverController.loginDriver,
);
router.post(
  '/delete-account',
  auth(ENUM_USER_ROLE.DRIVER),
  DriverController.deleteMyAccount,
);
router.patch(
  '/change-password',
  auth(ENUM_USER_ROLE.DRIVER),
  DriverController.changePassword,
);
router.post('/forgot-password', DriverController.forgotPass);
router.post('/reset-password', DriverController.resetPassword);
router.post('/resend', DriverController.resendActivationCode);
router.post('/verify-otp', DriverController.checkIsValidForgetActivationCode);

router.get(
  '/admin/drivers',
  auth(ENUM_USER_ROLE.ADMIN),
  DriverController.getAllDriver,
);

//!IDS Work
router.get(
  '/profile',
  auth(ENUM_USER_ROLE.DRIVER, ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN),
  DriverController.getSingleDriver,
);

router.patch(
  '/edit-profile',
  auth(ENUM_USER_ROLE.DRIVER),
  uploadFile(),
  DriverController.updateProfile,
);

export const DriverRoutes = router;

import express from 'express';
import auth from '../../middlewares/auth';
import { ENUM_USER_ROLE } from '../../../enums/user';
import { uploadFile } from '../../middlewares/fileUploader';
import { UserController } from '../user/user.controller';
import { AdminController } from '../admin/admin.controller';
import { validateRequest } from '../../middlewares/validateRequest';
import { UserValidation } from '../user/user.validations';
import { AdminValidation } from '../admin/admin.validation';

const router = express.Router();
//!User
router.post(
  '/register',
  validateRequest(UserValidation.create),
  UserController.registrationUser,
);
router.post('/activate-user', UserController.activateUser);
router.post(
  '/login',
  validateRequest(UserValidation.loginZodSchema),
  UserController.login,
);
router.delete(
  '/delete-account',
  auth(ENUM_USER_ROLE.USER),
  UserController.deleteMyAccount,
);
router.patch(
  '/change-password',
  auth(ENUM_USER_ROLE.USER),
  UserController.changePassword,
);
router.post('/forgot-password', UserController.forgotPass);
router.post('/reset-password', UserController.resetPassword);
router.post('/resend', UserController.resendActivationCode);
router.post('/verify-otp', UserController.checkIsValidForgetActivationCode);

router.get(
  '/admin/users',
  auth(ENUM_USER_ROLE.ADMIN),
  UserController.getAllUsers,
);

//!IDS Work
router.get(
  '/profile',
  auth(ENUM_USER_ROLE.USER, ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN),
  UserController.getSingleUser,
);

router.patch(
  '/edit-profile',
  auth(ENUM_USER_ROLE.USER),
  uploadFile(),
  UserController.updateProfile,
);

//! Admin Authentication Start
router.post(
  '/admin/register',
  validateRequest(AdminValidation.create),
  AdminController.registrationUser,
);
router.post(
  '/admin/login',
  validateRequest(UserValidation.loginZodSchema),
  AdminController.login,
);
router.post('/admin/refresh-token', AdminController.refreshToken);
router.post('/admin/forgot-password', AdminController.forgotPass);
router.post(
  '/admin/verify-otp',
  AdminController.checkIsValidForgetActivationCode,
);
router.post('/admin/reset-password', AdminController.resetPassword);
router.patch(
  '/admin/change-password',
  auth(ENUM_USER_ROLE.ADMIN),
  AdminController.changePassword,
);
router.post(
  '/admin/add-admin',
  auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN),
  validateRequest(AdminValidation.create),
  AdminController.registrationUser,
);
//! Admin Authentication End

router.get(
  '/admin/users',
  auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN),
  UserController.getAllUsers,
);

router.patch(
  '/admin/user-block/:id',
  auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN),
  UserController.blockUser,
);

router.get(
  '/admin/admins',
  auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN),
  AdminController.getAllAdmin,
);
router.post(
  '/admin/add-user',
  auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN),
  AdminController.createUser,
);

//! Admin Update
router.patch(
  '/admin/edit-profile/:id',
  auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN),
  uploadFile(),
  AdminController.updateAdmin,
);
router.get(
  '/admin/profile',
  auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN),
  AdminController.myProfile,
);
router.delete(
  '/admin/delete/:id',
  auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN),
  AdminController.deleteAdmin,
);
export const AuthRoutes = router;

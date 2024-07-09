import { Router } from 'express';
import auth from '../../middlewares/auth';
import { ENUM_USER_ROLE } from '../../../enums/user';
import { TripController } from './trip.controller';
import { validateRequest } from '../../middlewares/validateRequest';
import { TripValidation } from './trip.validation';
// import { TripService } from './trip.service';
const router = Router();

router.post(
  '/send-request',
  auth(ENUM_USER_ROLE.USER),
  validateRequest(TripValidation.createTrip),
  TripController.insertIntoDB,
);
router.get('/my-trips', auth(ENUM_USER_ROLE.DRIVER), TripController.myTrip);
router.get('/user-trip', auth(ENUM_USER_ROLE.USER), TripController.usersTrip);
router.get(
  '/track-lists',
  auth(ENUM_USER_ROLE.DRIVER, ENUM_USER_ROLE.USER),
  TripController.searchTrip,
);
router.get(
  '/track-list/:id',
  auth(ENUM_USER_ROLE.DRIVER, ENUM_USER_ROLE.USER),
  TripController.searchTripDetails,
);
router.get(
  '/requested-trips',
  auth(ENUM_USER_ROLE.DRIVER),
  TripController.myTripRequests,
);
router.patch(
  '/accept/:id',
  auth(ENUM_USER_ROLE.DRIVER),
  TripController.acceptTrip,
);
router.patch('/end/:id', auth(ENUM_USER_ROLE.DRIVER), TripController.endTrip);
router.patch(
  '/cancel/:id',
  auth(ENUM_USER_ROLE.DRIVER, ENUM_USER_ROLE.USER),
  TripController.cancelTrip,
);

export const TripRoutes = router;

import { Router } from 'express';
import auth from '../../middlewares/auth';
import { ENUM_USER_ROLE } from '../../../enums/user';
import { TripController } from './trip.controller';
const router = Router();

router.post(
  '/send-request',
  auth(ENUM_USER_ROLE.USER),
  TripController.insertIntoDB,
);
router.get('/my-trips', auth(ENUM_USER_ROLE.DRIVER), TripController.myTrip);
router.get(
  '/track-lists',
  auth(ENUM_USER_ROLE.DRIVER, ENUM_USER_ROLE.USER),
  TripController.searchTrip,
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

export const TripRoutes = router;

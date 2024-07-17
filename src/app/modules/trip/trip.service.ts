/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Request } from 'express';
import { IReqUser } from '../user/user.interface';
import { ITrip } from './trip.interface';
import User from '../user/user.model';
import ApiError from '../../../errors/ApiError';
import httpStatus from 'http-status';
import Trip from './trip.model';
import Driver from '../driver/driver.model';
import Notification from '../notifications/notifications.model';
import { Ratting } from '../rattings/rattings.model';

const insertIntoDB = async (req: Request) => {
  const { userId } = req.user as IReqUser;
  const tripData = req.body as ITrip;
  const isExistUser = await User.findById(userId);
  if (!isExistUser) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  const result = await Trip.create({
    ...tripData,
    user: userId,
  });
  if (result) {
    const notificationMessage = `You have a new trip request from ${tripData.pickup} to ${tripData.to}.`;
    const notification = await Notification.create({
      title: 'New Trip Has Arrived',
      driver: tripData?.driver,
      user: userId,
      message: notificationMessage,
    });
    //@ts-ignore
    const socketIo = global.io;
    if (socketIo) {
      socketIo.emit(`notification::${tripData?.driver}`, notification);
      socketIo.emit(`trips::${tripData?.driver}`, result);
    }
    return result;
  } else {
    return {
      message: 'Trip not send',
    };
  }
};
// const insertIntoDB = async (
//   req: Request,
//   res: Response,
//   next: NextFunction,
// ) => {
//   const session = await mongoose.startSession();
//   session.startTransaction();

//   try {
//     const { userId } = req.user as IReqUser;
//     const tripData = req.body as ITrip;

//     const isExistUser = await User.findById(userId).session(session);
//     if (!isExistUser) {
//       throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
//     }

//     const result = await Trip.create([{ ...tripData, user: userId }], {
//       session,
//     });
//     if (!result) {
//       throw new ApiError(
//         httpStatus.INTERNAL_SERVER_ERROR,
//         'Trip creation failed',
//       );
//     }
//     const notificationMessage = `You have a new trip request from ${tripData.pickup} to ${tripData.destination}.`;
//     await Notification.create(
//       [
//         {
//           driver: tripData.driver,
//           user: userId,
//           message: notificationMessage,
//         },
//       ],
//       { session },
//     );

//     await session.commitTransaction();
//     session.endSession();

//     res.status(httpStatus.CREATED).json(result[0]);
//   } catch (error) {
//     await session.abortTransaction();
//     session.endSession();
//     next(error);
//   }
// };

const myTrip = async (req: Request) => {
  const { userId } = req.user as IReqUser;
  const query = req.query as Record<string, unknown>;

  if (Object.keys(query).length > 0) {
    return await Trip.findOne({ driver: userId })
      .sort({ createdAt: -1 })
      .limit(1);
  } else {
    return await Trip.find({ driver: userId });
  }
};
const usersTrip = async (req: Request) => {
  const { userId } = req.user as IReqUser;

  return await Trip.findOne({ user: userId }).sort({ createdAt: -1 }).limit(1);
};
const myTripRequests = async (req: Request) => {
  const { userId } = req.user as IReqUser;
  return await Trip.find({
    $and: [{ driver: userId }, { acceptStatus: 'pending' }],
  });
};
const acceptTrip = async (req: Request) => {
  const { id } = req.params;
  const isExistTrip = await Trip.findById(id);
  if (!isExistTrip) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Trip not found');
  }
  if (isExistTrip.acceptStatus === 'accepted') {
    throw new ApiError(httpStatus.CONFLICT, 'Already accepted');
  }
  return await Trip.findByIdAndUpdate(
    id,
    { acceptStatus: 'accepted' },
    {
      new: true,
      runValidators: true,
    },
  );
};
const endTrip = async (req: Request) => {
  const { id } = req.params;
  const isExistTrip = await Trip.findById(id);
  if (!isExistTrip) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Trip not found');
  }
  if (isExistTrip.acceptStatus === 'end') {
    throw new ApiError(httpStatus.CONFLICT, 'Already ended');
  }
  const result = await Trip.findByIdAndUpdate(
    id,
    { acceptStatus: 'end' },
    {
      new: true,
      runValidators: true,
    },
  );
  const isReview = true;
  //@ts-ignore
  const socketIo = global.io;
  if (socketIo) {
    socketIo.emit(`endTrip::${isReview}`);
  }
  return result;
};
const cancelTrip = async (req: Request) => {
  const { id } = req.params;
  const isExistTrip = await Trip.findById(id);
  if (!isExistTrip) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Trip not found');
  }
  if (isExistTrip.acceptStatus === 'cancel') {
    throw new ApiError(httpStatus.CONFLICT, 'Already canceled');
  }
  return await Trip.findByIdAndUpdate(
    id,
    { acceptStatus: 'cancel' },
    {
      new: true,
      runValidators: true,
    },
  );
};
const searchTrip = async () => {
  // Step 1: Get average ratings for each driver
  const result = await Ratting.aggregate([
    {
      $group: {
        _id: '$driver',
        averageRating: { $avg: '$ratting' },
      },
    },
  ]);

  let formattedResult: any[] = [];
  if (result.length > 0) {
    formattedResult = result.map(driver => ({
      driver: driver._id.toString(),
      averageRating: Number(driver.averageRating.toFixed(2)),
    }));
  }

  const findDriver = await Driver.find({});

  const formattedData = findDriver.map(driver => {
    const driverRating =
      formattedResult.find(rat => rat.driver === driver._id.toString())
        ?.averageRating || 0;
    return {
      id: driver._id,
      trackImage: driver.truckImage,
      truckSize: driver.truckSize,
      cargoCapacity: driver.cargoCapacity,
      kmForPrice: driver.kmForPrice,
      price: driver.price,
      ratting: driverRating,
    };
  });

  return formattedData;
};

const searchTripDetails = async (id: string) => {
  const findDriver = await Driver.findById(id);

  const formattedData = {
    id: findDriver?._id,
    trackImage: findDriver?.truckImage,
    truckSize: findDriver?.truckSize,
    cargoCapacity: findDriver?.cargoCapacity,
    kmForPrice: findDriver?.kmForPrice,
    price: findDriver?.price,
  };
  return formattedData;
};
export const TripService = {
  insertIntoDB,
  myTrip,
  acceptTrip,
  myTripRequests,
  searchTrip,
  usersTrip,
  endTrip,
  cancelTrip,
  searchTripDetails,
};

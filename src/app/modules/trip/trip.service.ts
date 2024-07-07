import { Request } from 'express';
import { IReqUser } from '../user/user.interface';
import { ITrip } from './trip.interface';
import User from '../user/user.model';
import ApiError from '../../../errors/ApiError';
import httpStatus from 'http-status';
import Trip from './trip.model';
import Driver from '../driver/driver.model';

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
    return result;
  } else {
    return {
      message: 'Trip not send',
    };
  }
};
const myTrip = async (req: Request) => {
  const { userId } = req.user as IReqUser;
  const query = req.query as Record<string, unknown>;

  if (query?.current) {
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
  return await Trip.findByIdAndUpdate(
    id,
    { acceptStatus: 'end' },
    {
      new: true,
      runValidators: true,
    },
  );
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
  const findDriver = await Driver.find({});

  const formattedData = findDriver?.map(driver => ({
    trackImage: driver?.truckImage,
    truckSize: driver?.truckSize,
    cargoCapacity: driver?.cargoCapacity,
    kmForPrice: driver?.kmForPrice,
    price: driver?.price,
  }));
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
};

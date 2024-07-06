import { Request } from 'express';
import { IReqUser } from '../user/user.interface';
import { ITrip } from './trip.interface';
import User from '../user/user.model';
import ApiError from '../../../errors/ApiError';
import httpStatus from 'http-status';
import Trip from './trip.model';

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
  return await Trip.findByIdAndUpdate(
    id,
    { acceptStatus: 'accepted' },
    {
      new: true,
      runValidators: true,
    },
  );
};
export const TripService = {
  insertIntoDB,
  myTrip,
  acceptTrip,
  myTripRequests,
};

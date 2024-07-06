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

export const TripService = {
  insertIntoDB,
};

import { Request } from 'express';
import { IReqUser } from '../user/user.interface';
import User from '../user/user.model';
import ApiError from '../../../errors/ApiError';
import httpStatus from 'http-status';
import { Ratting } from './rattings.model';
import { Types } from 'mongoose';

const insertIntoDB = async (req: Request) => {
  const { userId } = req.user as IReqUser;
  const { driver, ratting } = req.body;
  const isExistUser = await User.findById(userId);

  if (!isExistUser) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  return await Ratting.create({
    user: userId,
    driver,
    ratting,
  });
};
const averageRattingForDriver = async (req: Request) => {
  const { id } = req.params;
  const driverObjectId = new Types.ObjectId(id);
  const result = await Ratting.aggregate([
    { $match: { driver: driverObjectId } },
    {
      $group: {
        _id: '$driver',
        averageRating: { $avg: '$ratting' },
      },
    },
  ]);

  if (result.length > 0) {
    const averageRating = result[0].averageRating.toFixed(2);
    return Number(averageRating);
  } else {
    return {
      message: 'No ratings found for this driver.',
    };
  }
};

export const RattingService = {
  insertIntoDB,
  averageRattingForDriver,
};

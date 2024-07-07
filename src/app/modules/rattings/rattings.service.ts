import { Request } from 'express';
import { IReqUser } from '../user/user.interface';
import User from '../user/user.model';
import ApiError from '../../../errors/ApiError';
import httpStatus from 'http-status';
import { Ratting } from './rattings.model';

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

export const RattingService = {
  insertIntoDB,
};

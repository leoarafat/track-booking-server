/* eslint-disable @typescript-eslint/ban-ts-comment */
import httpStatus from 'http-status';
import { JwtPayload } from 'jsonwebtoken';
import ApiError from '../../../errors/ApiError';
import { SubscriptionPlan } from '../subscriptions-plan/subscriptions-plan.model';
import User from '../user/user.model';
import { ISubscription } from './subscriptions.interface';
import { Subscription } from './subscriptions.model';
import Notification from '../notifications/notifications.model';

const upgradeSubscriptionToDB = async (
  user: JwtPayload,
  payload: Partial<ISubscription>,
) => {
  const isExistUser = await User.findById(user.userId);
  if (!isExistUser) {
    throw new ApiError(httpStatus.BAD_REQUEST, "User doesn't exist!");
  }

  const isExistSubscription = await SubscriptionPlan.findById(payload.plan_id);
  if (!isExistSubscription) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Plan doesn't exist!");
  }
  const alreadyHavePlan = await Subscription.findOne({ user_id: user.userId });

  if (alreadyHavePlan) {
    await Subscription.findOneAndDelete({ user_id: user?.userId });
  }

  isExistUser.isPaid = true;
  isExistUser.isSubscribed = true;
  const startDate = new Date();
  const monthsToAdd = isExistSubscription.packageDuration;
  const endDate = new Date(startDate);
  endDate.setMonth(endDate.getMonth() + monthsToAdd);

  const upgradeData = {
    user_id: user.userId,
    plan_id: payload.plan_id,
    startDate,
    endDate,
    payment_status: 'paid',
    status: 'active',
    transaction_id: payload.transaction_id,
    amount: payload.amount,
    plan_type: isExistSubscription?.packageName,
  };

  const result = await Subscription.create(upgradeData);
  const notification = await Notification.create({
    user: user.userId,
    title: 'Subscription Unlocked',
    message: `Successfully unlocked the Subscription package: ${isExistSubscription.packageName}.`,
    status: false,
    type: 'admin',
  });
  if (result) {
    await isExistUser.save();
  }
  //@ts-ignore
  global.io.to(user.toString()).emit('notification', notification);
  // global.io.to(user.toString()).emit('adminNotification', notification);
  return result;
};

const mySubscriptionFromDB = async (user: JwtPayload) => {
  const subscriptions = await Subscription.findOne({
    user_id: user.userId,
  }).populate({
    path: 'plan_id',
    select: '-updatedAt -createdAt -__v',
  });

  return subscriptions;
};

export const SubscriptionService = {
  upgradeSubscriptionToDB,
  mySubscriptionFromDB,
};

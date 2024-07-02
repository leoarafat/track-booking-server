import { Request } from 'express';
import Notification from './notifications.model';
import ApiError from '../../../errors/ApiError';
import { IReqUser } from '../user/user.interface';
import QueryBuilder from '../../../builder/QueryBuilder';

//Get
const getNotifications = async (query: Record<string, unknown>) => {
  const notificationQuery = new QueryBuilder(
    Notification.find({ type: 'admin' }),
    query,
  )
    .search(['title'])
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await notificationQuery.modelQuery;
  const meta = await notificationQuery.countTotal();

  const unreadNotification = await Notification.countDocuments({
    status: false,
  });
  const readNotification = await Notification.countDocuments({ status: true });

  return {
    unreadNotification,
    readNotification,
    meta,
    data: result,
  };
};
//Update
const updateNotification = async (req: Request) => {
  const notification = await Notification.findById(req.params.id);
  if (!notification) {
    throw new ApiError(404, 'Notification not found');
  } else {
    // eslint-disable-next-line no-unused-expressions
    notification.status ? (notification.status = true) : notification?.status;
  }
  await notification.save();
  const notifications = await Notification.find().sort({
    createdAt: -1,
  });
  return notifications;
};
const updateAll = async () => {
  const result = await Notification.updateMany(
    { status: false },
    { $set: { status: true } },
    { new: true },
  ).sort({ createdAt: -1 });
  return result;
};

const myNotification = async (
  user: IReqUser,
  query: Record<string, unknown>,
) => {
  const notificationQuery = new QueryBuilder(
    Notification.find({ user: user.userId }),
    query,
  )
    .search(['title'])
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await notificationQuery.modelQuery;
  const meta = await notificationQuery.countTotal();

  return {
    meta,
    data: result,
  };
};
export const NotificationService = {
  getNotifications,
  updateNotification,
  myNotification,
  updateAll,
};

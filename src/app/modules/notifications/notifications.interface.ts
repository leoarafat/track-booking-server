import { Types } from 'mongoose';
import { IUser } from '../user/user.interface';

export type INotification = {
  title: string;
  message: string;
  status: boolean;
  user: Types.ObjectId | IUser;
  type: 'user' | 'admin';
};

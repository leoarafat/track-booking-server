import { Types } from 'mongoose';
import { IUser } from '../user/user.interface';
import { IDriver } from '../driver/driver.interface';

export type INotification = {
  title: string;
  message: string;
  status: boolean;
  user: Types.ObjectId | IUser;
  driver: Types.ObjectId | IDriver;
  type: 'user' | 'admin' | 'driver';
};

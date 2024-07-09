import { Types } from 'mongoose';
import { IUser } from '../user/user.interface';
import { IDriver } from '../driver/driver.interface';

export type ITrip = {
  user: Types.ObjectId | IUser;
  driver: Types.ObjectId | IDriver;
  pickup: string;
  from: string;
  to: string;
  tripType: 'single' | 'round' | 'allDay';
  time: string;
  amount: number;
  distance: string;
  fee: number;
  acceptStatus: 'pending' | 'accepted' | 'end' | 'cancel';
};

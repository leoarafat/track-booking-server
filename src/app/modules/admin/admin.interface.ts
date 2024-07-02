/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-unused-vars */
import { Model } from 'mongoose';
export type IAdmin = {
  _id?: string;
  name: string;
  email: string;
  user_name: string;
  phone_number: string;
  address: string;
  gender: 'male' | 'female' | 'others';
  password: string;
  role: 'ADMIN' | 'SUPER_ADMIN';
  profile_image: string;
  date_of_birth: Date;
  location: string;
  language: string;
  relationship_status: string;
  verifyCode: string;
  verifyExpire: Date;
};
export type AdminModel = {
  isAdminExist(
    email: string,
  ): Promise<Pick<IAdmin, '_id' | 'email' | 'password' | 'role'>>;
  isPasswordMatched(
    givenPassword: string,
    savedPassword: string,
  ): Promise<boolean>;
} & Model<IAdmin>;

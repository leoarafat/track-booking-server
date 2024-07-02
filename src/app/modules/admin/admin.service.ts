/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-explicit-any */
import config from '../../../config';
import bcrypt from 'bcrypt';
import jwt, { Secret } from 'jsonwebtoken';
import ApiError from '../../../errors/ApiError';
import { jwtHelpers } from '../../../helpers/jwtHelpers';
import {
  IChangePassword,
  ILoginUser,
  ILoginUserResponse,
  IRefreshTokenResponse,
} from '../auth/auth.interface';
import { IRegistration, IReqUser, IUser } from '../user/user.interface';
import User from '../user/user.model';
import Admin from './admin.model';
import httpStatus from 'http-status';
import QueryBuilder from '../../../builder/QueryBuilder';
import { IGenericResponse } from '../../../interfaces/paginations';
import { updateImageUrl } from '../../../utils/url-modifier';
import { IAdmin } from './admin.interface';
import { sendResetEmail } from '../auth/sendResetMails';
import { ENUM_USER_ROLE } from '../../../enums/user';
import sendEmail from '../../../utils/sendEmail';
import { registrationSuccess } from './admi.email';
import Conversation from '../messages/conversation.model';
import { Request } from 'express';
import { logger } from '../../../shared/logger';

import mongoose from 'mongoose';
const { ObjectId } = mongoose.Types;
//!
const registrationUser = async (payload: IRegistration) => {
  const { name, email, password } = payload;

  const user = {
    name,
    email,
    password,
  };
  const isEmailExist = await Admin.findOne({ email });
  if (isEmailExist) {
    throw new ApiError(400, 'Email already exist');
  }
  const newUser = await Admin.create(payload);
  const data = { user: { name: user.name } };
  // const adminIds = await Admin.find({}).distinct('_id');

  // const uniqueAdminIds = adminIds
  //   .filter((id, index) => adminIds.indexOf(id) === index)
  //   .map(id => new ObjectId(id));
  // await Conversation.updateMany(
  //   {},
  //   { $addToSet: { participants: { $each: uniqueAdminIds } } },
  // );

  sendEmail({
    email: user.email,
    subject: 'Congratulations to register successfully',
    html: registrationSuccess(data),
  }).catch(error => {
    logger.error('Failed to send email:', error);
  });
  const { password: omit, ...userWithoutPassword } = newUser.toObject();

  return userWithoutPassword;
};
//!
const createUser = async (userData: IUser): Promise<IUser | null> => {
  const newUser = await User.create(userData);
  return newUser;
};
//!
const getAllUsers = async (
  query: Record<string, unknown>,
): Promise<IGenericResponse<IUser[]>> => {
  const userQuery = new QueryBuilder(User.find(), query)
    .search(['name', 'email'])
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await userQuery.modelQuery;
  const meta = await userQuery.countTotal();

  return {
    meta,
    data: result,
  };
};
//!
const getSingleUser = async (id: string): Promise<IUser | null> => {
  const result = await User.findById(id);
  if (!result) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  return result;
};
const getAllAdmin = async () => {
  const results = await Admin.find({}).lean();
  return results;
};
//!
const updateAdmin = async (
  id: string,
  req: Request,
): Promise<IAdmin | null> => {
  //@ts-ignore
  const { files } = req;

  let profile_image = undefined;

  //@ts-ignore
  if (files && files?.profile_image) {
    //@ts-ignore
    profile_image = `/images/profile/${files.profile_image[0].filename}`;
  }

  //@ts-ignore
  const data = req.body;
  if (!data) {
    throw new Error('Data is missing in the request body!');
  }

  const isExist = await Admin.findOne({ _id: id });

  if (!isExist) {
    throw new ApiError(404, 'Admin not found !');
  }

  const { ...adminData } = data;
  //@ts-ignore
  const updatedAdminData: Partial<IAdmin> = { ...adminData };

  const result = await Admin.findOneAndUpdate(
    { _id: id },
    { profile_image, ...updatedAdminData },
    {
      new: true,
    },
  );
  return result;
};
//!
const deleteUser = async (id: string): Promise<IUser | null> => {
  const result = await User.findByIdAndDelete(id);
  return result;
};

//!
const login = async (payload: ILoginUser): Promise<ILoginUserResponse> => {
  const { email, password } = payload;

  const isUserExist = await Admin.isAdminExist(email);

  if (!isUserExist) {
    throw new ApiError(404, 'Admin does not exist');
  }

  if (
    isUserExist.password &&
    !(await Admin.isPasswordMatched(password, isUserExist.password))
  ) {
    throw new ApiError(402, 'Password is incorrect');
  }

  //create access token & refresh token

  const { _id: userId, role } = isUserExist;
  const accessToken = jwtHelpers.createToken(
    { userId, role },
    config.jwt.secret as Secret,
    config.jwt.expires_in as string,
  );
  //Create refresh token
  const refreshToken = jwtHelpers.createToken(
    { userId, role },
    config.jwt.refresh_secret as Secret,
    config.jwt.refresh_expires_in as string,
  );

  return {
    accessToken,
    refreshToken,
    //@ts-ignore
  };
};
//!
const refreshToken = async (token: string): Promise<IRefreshTokenResponse> => {
  //verify token
  // invalid token - synchronous
  let verifiedToken = null;
  try {
    verifiedToken = jwtHelpers.verifyToken(
      token,
      config.jwt.refresh_secret as Secret,
    );
  } catch (err) {
    throw new ApiError(402, 'Invalid Refresh Token');
  }

  const { userId } = verifiedToken;

  // checking deleted user's refresh token

  const isUserExist = await Admin.isAdminExist(userId);
  if (!isUserExist) {
    throw new ApiError(403, 'Admin does not exist');
  }
  //generate new token

  const newAccessToken = jwtHelpers.createToken(
    {
      id: isUserExist._id,
      role: isUserExist.role,
    },
    config.jwt.secret as Secret,
    config.jwt.expires_in as string,
  );

  return {
    accessToken: newAccessToken,
  };
};
//!
const changePassword = async (
  user: IReqUser,
  payload: IChangePassword,
): Promise<void> => {
  const { oldPassword, newPassword } = payload;

  const isAdminExist = await Admin.findOne({ _id: user?.userId }).select(
    '+password',
  );

  if (!isAdminExist) {
    throw new ApiError(404, 'Admin does not exist');
  }
  if (
    isAdminExist.password &&
    !(await Admin.isPasswordMatched(oldPassword, isAdminExist.password))
  ) {
    throw new ApiError(402, 'Old password is incorrect');
  }
  isAdminExist.password = newPassword;
  isAdminExist.save();
};
// //!
// const forgotPass = async (payload: { email: string }) => {
//   const admin = await Admin.findOne(
//     { email: payload.email },
//     { _id: 1, role: 1 },
//   );

//   if (!admin) {
//     throw new ApiError(httpStatus.BAD_REQUEST, 'Admin does not exist!');
//   }

//   let profile = null;
//   if (admin.role === ENUM_USER_ROLE.ADMIN) {
//     profile = await Admin.findOne({ _id: admin?._id });
//   }

//   if (!profile) {
//     throw new ApiError(httpStatus.BAD_REQUEST, 'Pofile not found!');
//   }

//   if (!profile.email) {
//     throw new ApiError(httpStatus.BAD_REQUEST, 'Email not found!');
//   }

//   const passResetToken = await jwtHelpers.createResetToken(
//     { _id: admin._id },
//     config.jwt.secret as string,
//     '30m',
//   );

//   // const resetLink: string = config.resetlink + `token=${passResetToken}`;
//   const resetLink: string = `${config.resetlink}token=${passResetToken}&email=${profile.email}`;
//   sendResetEmail(
//     profile.email,
//     `
//       <div>
//         <p>Hi, ${profile.name}</p>
//         <p>Your password reset link: <a href=${resetLink}>Click Here</a></p>
//         <p>Thank you</p>
//       </div>
//   `,
//   );
// };
// //!
// const resetPassword = async (
//   payload: { email: string; newPassword: string },
//   token: string,
// ) => {
//   const { email, newPassword } = payload;
//   const admin = await Admin.findOne({ email }, { _id: 1 });

//   if (!admin) {
//     throw new ApiError(httpStatus.BAD_REQUEST, 'admin not found!');
//   }

//   await jwtHelpers.verifyToken(token, config.jwt.secret as string);

//   const password = await bcrypt.hash(
//     newPassword,
//     Number(config.bcrypt_salt_rounds),
//   );

//   await Admin.updateOne({ email }, { password }, { new: true });
// };
//!
const forgotPass = async (payload: { email: string }) => {
  const admin = (await Admin.findOne(
    { email: payload.email },
    { _id: 1, role: 1 },
  )) as IUser;

  if (!admin) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'admin does not exist!');
  }

  let profile = null;
  if (admin.role === ENUM_USER_ROLE.ADMIN || ENUM_USER_ROLE.SUPER_ADMIN) {
    profile = await Admin.findOne({ _id: admin?._id });
  }

  if (!profile) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Pofile not found!');
  }

  if (!profile.email) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Email not found!');
  }

  const activationCode = forgetActivationCode();
  const expiryTime = new Date(Date.now() + 15 * 60 * 1000);
  admin.verifyCode = activationCode;
  admin.verifyExpire = expiryTime;
  await admin.save();

  sendResetEmail(
    profile.email,
    `
      <div>
        <p>Hi, ${profile.name}</p>
        <p>Your password reset Code: ${activationCode}</p>
        <p>Thank you</p>
      </div>
  `,
  );
};
//!

const forgetActivationCode = () => {
  const activationCode = Math.floor(100000 + Math.random() * 900000).toString();
  return activationCode;
};
const checkIsValidForgetActivationCode = async (payload: {
  code: string;
  email: string;
}) => {
  const admin = await Admin.findOne({ email: payload.email });

  if (!admin) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'admin does not exist!');
  }

  if (admin.verifyCode !== payload.code) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid reset code!');
  }

  const currentTime = new Date();
  if (currentTime > admin.verifyExpire) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Reset code has expired!');
  }

  return { valid: true };
};
//!
const resetPassword = async (payload: {
  email: string;
  newPassword: string;
  confirmPassword: string;
}) => {
  const { email, newPassword, confirmPassword } = payload;

  if (newPassword !== confirmPassword) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Password didn't match");
  }
  const admin = await Admin.findOne({ email }, { _id: 1 });

  if (!admin) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'admin not found!');
  }

  const password = await bcrypt.hash(
    newPassword,
    Number(config.bcrypt_salt_rounds),
  );

  await Admin.updateOne({ email }, { password }, { new: true });
  //@ts-ignore
  admin.verifyCode = null;
  //@ts-ignore
  admin.verifyExpire = null;
  await admin.save();
};
//!
const myProfile = async (req: Request) => {
  const { userId } = req.user as IReqUser;
  const result = await Admin.findById(userId);
  if (!result) {
    throw new ApiError(404, 'Profile not found');
  }
  return result;
};
const deleteAdmin = async (id: string) => {
  const result = await Admin.findByIdAndDelete(id);

  return result;
};
export const AdminService = {
  createUser,
  getAllUsers,
  getSingleUser,
  deleteUser,
  registrationUser,
  login,
  changePassword,
  refreshToken,
  updateAdmin,
  getAllAdmin,
  myProfile,
  forgotPass,
  resetPassword,
  deleteAdmin,
  checkIsValidForgetActivationCode,
};

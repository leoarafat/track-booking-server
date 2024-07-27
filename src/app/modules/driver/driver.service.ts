/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-explicit-any */

import bcrypt from 'bcrypt';
import ApiError from '../../../errors/ApiError';
import cron from 'node-cron';
import { JwtPayload, Secret } from 'jsonwebtoken';
import config from '../../../config';
import { Request } from 'express';
import { jwtHelpers } from '../../../helpers/jwtHelpers';
import { IChangePassword, ILoginUser } from '../auth/auth.interface';
import QueryBuilder from '../../../builder/QueryBuilder';
import { IGenericResponse } from '../../../interfaces/paginations';
import httpStatus from 'http-status';
import sendEmail from '../../../utils/sendEmail';
import { registrationSuccessEmailBody } from '../../../mails/user.register';
import { ENUM_USER_ROLE } from '../../../enums/user';
import { sendResetEmail } from '../auth/sendResetMails';
import { logger } from '../../../shared/logger';
import { IActivationRequest, IDriver } from './driver.interface';
import Driver from './driver.model';
import { IReqUser } from '../user/user.interface';
import { CustomRequest } from '../../../interfaces/common';

//!
const registerDriver = async (req: CustomRequest) => {
  const { files } = req;
  const payload = req.body as unknown as IDriver;
  const { name, email, password, confirmPassword } = payload;

  payload.expirationTime = (Date.now() + 2 * 60 * 1000) as any;

  const isEmailExist = await Driver.findOne({ email });

  if (isEmailExist) {
    throw new ApiError(400, 'Email already exist');
  }

  if (confirmPassword !== password) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "Password and Confirm Password Didn't Match",
    );
  }
  if (files) {
    if (files.licenseFrontImage) {
      payload.licenseFrontImage = `/images/licenses/${files.licenseFrontImage[0].filename}`;
    }
    if (files.licenseBackImage) {
      payload.licenseBackImage = `/images/licenses/${files.licenseBackImage[0].filename}`;
    }
    if (files.truckDocumentImage) {
      payload.truckDocumentImage = `/images/trucks/${files.truckDocumentImage[0].filename}`;
    }
    if (files.truckImage) {
      payload.truckImage = `/images/trucks/${files.truckImage[0].filename}`;
    }
  }
  const activationToken = createActivationToken();
  const activationCode = activationToken.activationCode;
  const data = { user: { name: name }, activationCode };

  try {
    sendEmail({
      email: email,
      subject: 'Activate Your Account',
      html: registrationSuccessEmailBody(data),
    });
  } catch (error: any) {
    throw new ApiError(500, `${error.message}`);
  }
  payload.activationCode = activationCode;
  return await Driver.create(payload);
};
//!
const updateProfile = async (req: CustomRequest): Promise<IDriver | null> => {
  const { files } = req;
  const { userId } = req.user as IReqUser;
  //@ts-ignore
  const data = req.body;

  const checkValidDriver = await Driver.findById(userId);
  if (!checkValidDriver) {
    throw new ApiError(404, 'You are not authorized');
  }

  if (files) {
    if (files.licenseFrontImage) {
      //@ts-ignore
      data.licenseFrontImage = `/images/licenses/${files.licenseFrontImage[0].filename}`;
    }
    if (files.licenseBackImage) {
      //@ts-ignore
      data.licenseBackImage = `/images/licenses/${files.licenseBackImage[0].filename}`;
    }
    if (files.truckDocumentImage) {
      //@ts-ignore
      data.truckDocumentImage = `/images/trucks/${files.truckDocumentImage[0].filename}`;
    }
    if (files.truckImage) {
      //@ts-ignore
      data.truckImage = `/images/trucks/${files.truckImage[0].filename}`;
    }
    if (files.profile_image) {
      //@ts-ignore
      data.profile_image = `/images/image/${files.profile_image[0].filename}`;
    }
  }

  const { ...DriverData } = data;

  const updatedUserData = { ...DriverData };

  const result = await Driver.findOneAndUpdate(
    { _id: userId },
    { ...updatedUserData },
    {
      new: true,
    },
  );
  return result;
};
//!
const createActivationToken = () => {
  const activationCode = Math.floor(100000 + Math.random() * 900000).toString();

  return { activationCode };
};

//!
const activateDriver = async (payload: { code: string; email: string }) => {
  const { code, email } = payload;

  const existUser = await Driver.findOne({ email: email });
  if (!existUser) {
    throw new ApiError(400, 'Driver not found');
  }
  if (existUser.activationCode !== code) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Code didn't match");
  }
  const driver = (await Driver.findOneAndUpdate(
    { email: email },
    { isActive: true },
    {
      new: true,
      runValidators: true,
    },
  )) as IDriver;

  const accessToken = jwtHelpers.createToken(
    {
      userId: existUser._id,
      role: existUser.role,
    },
    config.jwt.secret as Secret,
    config.jwt.expires_in as string,
  );
  //Create refresh token
  const refreshToken = jwtHelpers.createToken(
    { userId: existUser._id, role: existUser.role },
    config.jwt.refresh_secret as Secret,
    config.jwt.refresh_expires_in as string,
  );
  return {
    accessToken,
    refreshToken,
    driver,
  };
};

cron.schedule('* * * * *', async () => {
  try {
    const now = new Date();
    const result = await Driver.deleteMany({
      isActive: false,
      expirationTime: { $lte: now },
    });
    if (result.deletedCount > 0) {
      logger.info(`Deleted ${result.deletedCount} expired inactive users`);
    }
  } catch (error) {
    logger.error('Error deleting expired users:', error);
  }
});
//!
const getAllDriver = async (
  query: Record<string, unknown>,
): Promise<IGenericResponse<IDriver[]>> => {
  const driverQuery = new QueryBuilder(Driver.find(), query)
    .search(['name'])
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await driverQuery.modelQuery;
  const meta = await driverQuery.countTotal();

  return {
    meta,
    data: result,
  };
};
//!

//!
const getSingleDriver = async (user: IReqUser) => {
  const result = await Driver.findById(user?.userId);
  if (!result) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Driver not found');
  }

  return result;
};

//!
const deleteDriver = async (id: string): Promise<IDriver | null> => {
  const result = await Driver.findByIdAndDelete(id);

  return result;
};
//!
const loginDriver = async (payload: ILoginUser) => {
  const { email, password } = payload;

  const isDriverExist = (await Driver.isDriverExist(email)) as IDriver;
  const checkDriver = await Driver.findOne({ email });
  if (!isDriverExist) {
    throw new ApiError(404, 'Driver does not exist');
  }

  if (
    isDriverExist.password &&
    !(await Driver.isPasswordMatched(password, isDriverExist.password))
  ) {
    throw new ApiError(402, 'Wrong credentials');
  }
  if (isDriverExist.isActive === false) {
    throw new ApiError(
      httpStatus.UNAUTHORIZED,
      'Please active your account then try to login',
    );
  }

  const { _id: userId, role } = isDriverExist;
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
    id: checkDriver?._id,
    accessToken,
    refreshToken,
  };
};
//!
const deleteMyAccount = async (payload: {
  email: string;
  password: string;
}) => {
  const { email, password } = payload;

  const isDriverExist = await Driver.isDriverExist(email);
  //@ts-ignore
  if (!isDriverExist) {
    throw new ApiError(404, 'Driver does not exist');
  }

  if (
    isDriverExist.password &&
    !(await Driver.isPasswordMatched(password, isDriverExist.password))
  ) {
    throw new ApiError(402, 'Password is incorrect');
  }
  return await Driver.findOneAndDelete({ email });
};

//!
const changePassword = async (
  user: JwtPayload | null,
  payload: IChangePassword,
): Promise<void> => {
  const { userId } = user as any;
  //@ts-ignore
  const { oldPassword, newPassword, confirmPassword } = payload;
  if (newPassword !== confirmPassword) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      'Password and Confirm password not match',
    );
  }
  const isDriverExist = await Driver.findOne({ _id: userId }).select(
    '+password',
  );
  if (!isDriverExist) {
    throw new ApiError(404, 'Driver does not exist');
  }
  if (
    isDriverExist.password &&
    !(await Driver.isPasswordMatched(oldPassword, isDriverExist.password))
  ) {
    throw new ApiError(402, 'Old password is incorrect');
  }
  isDriverExist.password = newPassword;
  await isDriverExist.save();
};

//!
const forgotPass = async (payload: { email: string }) => {
  const user = (await Driver.findOne(
    { email: payload.email },
    { _id: 1, role: 1 },
  )) as IDriver;

  if (!user) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Driver does not exist!');
  }

  let profile = null;
  if (user.role === ENUM_USER_ROLE.DRIVER) {
    profile = await Driver.findOne({ _id: user?._id });
  }

  if (!profile) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Pofile not found!');
  }

  if (!profile.email) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Email not found!');
  }

  const activationCode = forgetActivationCode();
  const expiryTime = new Date(Date.now() + 15 * 60 * 1000);
  user.verifyCode = activationCode;
  user.verifyExpire = expiryTime;
  await user.save();

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
const resendActivationCode = async (payload: { email: string }) => {
  const email = payload.email;
  const user = await Driver.findOne({ email });

  if (!user) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Driver does not exist!');
  }

  let profile = null;
  if (user.role === ENUM_USER_ROLE.DRIVER) {
    profile = await Driver.findOne({ _id: user._id });
  }

  if (!profile) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Profile not found!');
  }

  if (!profile.email) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Email not found!');
  }

  const activationCode = forgetActivationCode();
  const expiryTime = new Date(Date.now() + 15 * 60 * 1000);
  user.verifyCode = activationCode;
  user.verifyExpire = expiryTime;
  await user.save();

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
//!
const checkIsValidForgetActivationCode = async (payload: {
  code: string;
  email: string;
}) => {
  const user = await Driver.findOne({ email: payload.email });

  if (!user) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Driver does not exist!');
  }

  if (user.verifyCode !== payload.code) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid reset code!');
  }

  const currentTime = new Date();
  if (currentTime > user.verifyExpire) {
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
  const user = await Driver.findOne({ email }, { _id: 1 });

  if (!user) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'User not found!');
  }

  const password = await bcrypt.hash(
    newPassword,
    Number(config.bcrypt_salt_rounds),
  );

  await Driver.updateOne({ email }, { password }, { new: true });
  //@ts-ignore
  user.verifyCode = null;
  //@ts-ignore
  user.verifyExpire = null;
  await user.save();
};

const blockDriver = async (id: string): Promise<IDriver | null> => {
  const isDriverExist = await Driver.findById(id);
  if (!isDriverExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'No Driver Found');
  }
  const result = await Driver.findByIdAndUpdate(
    { _id: id },
    { is_block: !isDriverExist.is_block },
    { new: true },
  );

  return result;
};

export const DriverService = {
  getAllDriver,
  getSingleDriver,
  deleteDriver,
  registerDriver,
  loginDriver,
  changePassword,
  updateProfile,
  forgotPass,
  resetPassword,
  activateDriver,
  deleteMyAccount,
  checkIsValidForgetActivationCode,
  resendActivationCode,
  blockDriver,
};

/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-ts-comment */
import config from '../../../config';
import bcrypt from 'bcrypt';
import User from '../user/user.model';
import { jwtHelpers } from '../../../helpers/jwtHelpers';
import ApiError from '../../../errors/ApiError';
import httpStatus from 'http-status';
import { ENUM_USER_ROLE } from '../../../enums/user';
import Admin from '../admin/admin.model';
import { sendResetEmail } from './sendResetMails';

//! This is forget password controller
const forgotPass = async (payload: { email: string }) => {
  const user = await User.findOne(
    { email: payload.email },
    { _id: 1, role: 1 },
  );

  if (!user) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'User does not exist!');
  }

  let profile = null;
  if (user.role === ENUM_USER_ROLE.ADMIN) {
    profile = await Admin.findOne({ _id: user.id });
  } else if (user.role === ENUM_USER_ROLE.USER) {
    profile = await User.findOne({ _id: user.id });
  }

  if (!profile) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Pofile not found!');
  }

  if (!profile.email) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Email not found!');
  }

  const passResetToken = await jwtHelpers.createResetToken(
    { _id: user.id },
    config.jwt.secret as string,
    '50m',
  );

  // const resetLink: string = config.resetlink + `token=${passResetToken}`;
  const resetLink: string = `${config.resetlink}token=${passResetToken}&email=${profile.email}`;
  await sendResetEmail(
    profile.email,
    `
      <div>
        <p>Hi, ${profile.name}</p>
        <p>Your password reset link: <a href=${resetLink}>Click Here</a></p>
        <p>Thank you</p>
      </div>
  `,
  );
};
//! This is reset i means set new password controller
const resetPassword = async (
  payload: { email: string; newPassword: string },
  token: string,
) => {
  const { email, newPassword } = payload;
  const user = await User.findOne({ email }, { _id: 1 });

  if (!user) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'User not found!');
  }

  await jwtHelpers.verifyToken(token, config.jwt.secret as string);

  const password = await bcrypt.hash(
    newPassword,
    Number(config.bcrypt_salt_rounds),
  );

  await User.updateOne({ email }, { password });
};
export const AuthService = {
  forgotPass,
  resetPassword,
};

/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Request, RequestHandler, Response } from 'express';
import { UserService } from './user.service';
import sendResponse from '../../../shared/sendResponse';
import { IReqUser, IUser } from './user.interface';
import catchAsync from '../../../shared/catchasync';
import config from '../../../config';
import { ILoginUserResponse } from '../auth/auth.interface';

const registrationUser: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    await UserService.registrationUser(req.body);

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: `Please check your email to active your account`,
    });
  },
);
const activateUser: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const result = await UserService.activateUser(req.body);
    const { refreshToken } = result;
    // set refresh token into cookie
    const cookieOptions = {
      secure: config.env === 'production',
      httpOnly: true,
    };
    res.cookie('refreshToken', refreshToken, cookieOptions);
    // await UserService.activateUser(req.body);

    sendResponse(res, {
      statusCode: 201,
      success: true,
      message: 'User activate successful',
      data: result,
    });
  },
);

const getAllUsers = catchAsync(async (req: Request, res: Response) => {
  const result = await UserService.getAllUsers(req.query);
  sendResponse<IUser[]>(res, {
    statusCode: 200,
    success: true,
    message: 'User retrieved successfully',
    data: result.data,
    meta: result.meta,
  });
});
const getSingleUser = catchAsync(async (req: Request, res: Response) => {
  const result = await UserService.getSingleUser(req.user as IReqUser);
  sendResponse<IUser>(res, {
    statusCode: 200,
    success: true,
    message: 'User retrieved successfully',
    //@ts-ignore
    data: result,
  });
});

const deleteUser = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;
  const result = await UserService.deleteUser(id);
  sendResponse<IUser>(res, {
    statusCode: 200,
    success: true,
    message: 'User deleted successfully',
    data: result,
  });
});
const login = catchAsync(async (req: Request, res: Response) => {
  const { ...loginData } = req.body;
  const result = await UserService.loginUser(loginData);
  const { refreshToken } = result;
  // set refresh token into cookie
  const cookieOptions = {
    secure: config.env === 'production',
    httpOnly: true,
  };
  res.cookie('refreshToken', refreshToken, cookieOptions);
  sendResponse<ILoginUserResponse>(res, {
    statusCode: 200,
    success: true,
    message: 'User loggedin successfully !',
    data: result,
  });
});

const changePassword = catchAsync(async (req: Request, res: Response) => {
  const { ...passwordData } = req.body;
  const user = req.user;
  // console.log(user, passwordData, 'user, passwordData');
  await UserService.changePassword(user, passwordData);
  sendResponse<ILoginUserResponse>(res, {
    statusCode: 200,
    success: true,
    message: 'Password change successfully !',
  });
});
const updateProfile = catchAsync(async (req: Request, res: Response) => {
  const result = await UserService.updateProfile(req);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Profile update successfully',
    data: result,
  });
});
const forgotPass = catchAsync(async (req: Request, res: Response) => {
  await UserService.forgotPass(req.body);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Check your email!',
  });
});
const checkIsValidForgetActivationCode = catchAsync(
  async (req: Request, res: Response) => {
    const result = await UserService.checkIsValidForgetActivationCode(req.body);
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: 'Success!',
      data: result,
    });
  },
);

const resendActivationCode: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const data = req.body;

    const result = await UserService.resendActivationCode(data);

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: 'Resend successfully',
      data: result,
    });
  },
);
const resetPassword = catchAsync(async (req: Request, res: Response) => {
  // const token = req.headers.authorization || '';
  await UserService.resetPassword(req.body);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Account recovered!',
  });
});
const deleteMyAccount = catchAsync(async (req: Request, res: Response) => {
  await UserService.deleteMyAccount(req.body);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Account deleted!',
  });
});

const blockUser = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;
  const result = await UserService.blockUser(id);
  sendResponse<IUser>(res, {
    statusCode: 200,
    success: true,
    message: 'User Blocked successfully',
    data: result,
  });
});

export const UserController = {
  getAllUsers,
  getSingleUser,
  deleteUser,
  registrationUser,
  login,
  changePassword,

  updateProfile,
  forgotPass,
  resetPassword,
  activateUser,
  deleteMyAccount,
  checkIsValidForgetActivationCode,
  resendActivationCode,
  blockUser,
};

/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Request, RequestHandler, Response } from 'express';
import sendResponse from '../../../shared/sendResponse';
import catchAsync from '../../../shared/catchasync';
import config from '../../../config';

import { DriverService } from './driver.service';
import { IDriver } from './driver.interface';
import { IReqUser } from '../user/user.interface';
import { ILoginUserResponse } from '../auth/auth.interface';

const registerDriver: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    await DriverService.registerDriver(req as any);

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: `Please check your email to active your account`,
    });
  },
);
const activateDriver: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const result = await DriverService.activateDriver(req.body);
    const { refreshToken } = result;
    // set refresh token into cookie
    const cookieOptions = {
      secure: config.env === 'production',
      httpOnly: true,
    };
    res.cookie('refreshToken', refreshToken, cookieOptions);
    // await DriverService.activateDriver(req.body);

    sendResponse(res, {
      statusCode: 201,
      success: true,
      message: 'Driver activate successful',
      data: result,
    });
  },
);

const getAllDriver = catchAsync(async (req: Request, res: Response) => {
  const result = await DriverService.getAllDriver(req.query);
  sendResponse<IDriver[]>(res, {
    statusCode: 200,
    success: true,
    message: 'Driver retrieved successfully',
    data: result.data,
    meta: result.meta,
  });
});
const getSingleDriver = catchAsync(async (req: Request, res: Response) => {
  const result = await DriverService.getSingleDriver(req.user as IReqUser);
  sendResponse<IDriver>(res, {
    statusCode: 200,
    success: true,
    message: 'Driver retrieved successfully',
    //@ts-ignore
    data: result,
  });
});

const deleteDriver = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;
  const result = await DriverService.deleteDriver(id);
  sendResponse<IDriver>(res, {
    statusCode: 200,
    success: true,
    message: 'Driver deleted successfully',
    data: result,
  });
});
const loginDriver = catchAsync(async (req: Request, res: Response) => {
  const { ...loginData } = req.body;
  const result = await DriverService.loginDriver(loginData);
  const { refreshToken } = result;

  const cookieOptions = {
    secure: config.env === 'production',
    httpOnly: true,
  };
  res.cookie('refreshToken', refreshToken, cookieOptions);
  sendResponse<ILoginUserResponse>(res, {
    statusCode: 200,
    success: true,
    message: 'Driver loggedin successfully !',
    data: result,
  });
});

const changePassword = catchAsync(async (req: Request, res: Response) => {
  const { ...passwordData } = req.body;
  const Driver = req.user;
  // console.log(Driver, passwordData, 'Driver, passwordData');
  await DriverService.changePassword(Driver, passwordData);
  sendResponse<ILoginUserResponse>(res, {
    statusCode: 200,
    success: true,
    message: 'Password change successfully !',
  });
});
const updateProfile = catchAsync(async (req: Request, res: Response) => {
  const result = await DriverService.updateProfile(req as any);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Profile update successfully',
    data: result,
  });
});
const forgotPass = catchAsync(async (req: Request, res: Response) => {
  await DriverService.forgotPass(req.body);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Check your email!',
  });
});
const checkIsValidForgetActivationCode = catchAsync(
  async (req: Request, res: Response) => {
    const result = await DriverService.checkIsValidForgetActivationCode(
      req.body,
    );
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

    const result = await DriverService.resendActivationCode(data);

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
  await DriverService.resetPassword(req.body);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Account recovered!',
  });
});
const deleteMyAccount = catchAsync(async (req: Request, res: Response) => {
  await DriverService.deleteMyAccount(req.body);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Account deleted!',
  });
});

const blockDriver = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;
  const result = await DriverService.blockDriver(id);
  sendResponse<IDriver>(res, {
    statusCode: 200,
    success: true,
    message: 'Driver Blocked successfully',
    data: result,
  });
});

export const DriverController = {
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

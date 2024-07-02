import { Request, RequestHandler, Response } from 'express';
import catchAsync from '../../../shared/catchasync';
import sendResponse from '../../../shared/sendResponse';
import { AdminService } from './admin.service';
import { IReqUser, IUser } from '../user/user.interface';
import config from '../../../config';
import {
  ILoginUserResponse,
  IRefreshTokenResponse,
} from '../auth/auth.interface';
import { IAdmin } from './admin.interface';

const registrationUser: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const result = await AdminService.registrationUser(req.body);

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: `Admin Created`,
      data: result,
    });
  },
);

const createUser: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const { ...userData } = req.body;

    const result = await AdminService.createUser(userData);

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: 'User created successfully',
      data: result,
    });
  },
);
const getAllUsers = catchAsync(async (req: Request, res: Response) => {
  const result = await AdminService.getAllUsers(req.query);
  sendResponse<IUser[]>(res, {
    statusCode: 200,
    success: true,
    message: 'User retrieved successfully',
    data: result.data,
    meta: result.meta,
  });
});
const getSingleUser = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;
  const result = await AdminService.getSingleUser(id);
  sendResponse<IUser>(res, {
    statusCode: 200,
    success: true,
    message: 'User retrieved successfully',
    data: result,
  });
});
const updateAdmin = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;
  const result = await AdminService.updateAdmin(id, req as any);
  sendResponse<IAdmin>(res, {
    statusCode: 200,
    success: true,
    message: 'Admin updated successfully',
    data: result,
  });
});
const deleteUser = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;
  const result = await AdminService.deleteUser(id);
  sendResponse<IUser>(res, {
    statusCode: 200,
    success: true,
    message: 'User deleted successfully',
    data: result,
  });
});
const login = catchAsync(async (req: Request, res: Response) => {
  const { ...loginData } = req.body;
  const result = await AdminService.login(loginData);
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
    message: 'Admin loggedin successfully !',
    data: result,
  });
});

const refreshToken = catchAsync(async (req: Request, res: Response) => {
  const { refreshToken } = req.cookies;
  const result = await AdminService.refreshToken(refreshToken);
  // set refresh token into cookie
  const cookieOptions = {
    secure: config.env === 'production',
    httpOnly: true,
  };

  res.cookie('refreshToken', refreshToken, cookieOptions);

  sendResponse<IRefreshTokenResponse>(res, {
    statusCode: 200,
    success: true,
    message: 'Admin lohggedin successfully !',
    data: result,
  });
});
const changePassword = catchAsync(async (req: Request, res: Response) => {
  const { ...passwordData } = req.body;

  await AdminService.changePassword(req.user as IReqUser, passwordData);
  sendResponse<ILoginUserResponse>(res, {
    statusCode: 200,
    success: true,
    message: 'Password change successfully !',
  });
});

const getAllAdmin = catchAsync(async (req: Request, res: Response) => {
  const result = await AdminService.getAllAdmin();
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'successful!',
    data: result,
  });
});
const myProfile = catchAsync(async (req: Request, res: Response) => {
  const result = await AdminService.myProfile(req);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'successful!',
    data: result,
  });
});
const forgotPass = catchAsync(async (req: Request, res: Response) => {
  await AdminService.forgotPass(req.body);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Check your email!',
  });
});
const resetPassword = catchAsync(async (req: Request, res: Response) => {
  // const token = req.headers.authorization || '';
  await AdminService.resetPassword(req.body);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Account recovered!',
  });
});
const deleteAdmin = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;
  const result = await AdminService.deleteAdmin(id);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Admin deleted successfully',
    data: result,
  });
});
const checkIsValidForgetActivationCode = catchAsync(
  async (req: Request, res: Response) => {
    const result = await AdminService.checkIsValidForgetActivationCode(
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
export const AdminController = {
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

import { Request, Response } from 'express';
import catchAsync from '../../../shared/catchasync';
import { DashboardService } from './dashboard.service';
import sendResponse from '../../../shared/sendResponse';
import { IDriver } from '../driver/driver.interface';
import { IUser } from '../user/user.interface';

const totalCount = catchAsync(async (req: Request, res: Response) => {
  const result = await DashboardService.totalCount();
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Data retrieved successful',
    data: result,
  });
});

const getDriverGrowth = catchAsync(async (req: Request, res: Response) => {
  const year = req.query.year
    ? parseInt(req.query.year as string, 10)
    : undefined;
  const result = await DashboardService.getDriverGrowth(year);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Data retrieved successful',
    data: result,
  });
});
const getAllDriver = catchAsync(async (req: Request, res: Response) => {
  const result = await DashboardService.getAllDriver(req.query);
  sendResponse<IDriver[]>(res, {
    statusCode: 200,
    success: true,
    message: 'Driver retrieved successfully',
    data: result.data,
    meta: result.meta,
  });
});
const getAllUsers = catchAsync(async (req: Request, res: Response) => {
  const result = await DashboardService.getAllUsers(req.query);
  sendResponse<IUser[]>(res, {
    statusCode: 200,
    success: true,
    message: 'Users retrieved successfully',
    data: result.data,
    meta: result.meta,
  });
});
export const DashboardController = {
  totalCount,
  getDriverGrowth,
  getAllDriver,
  getAllUsers,
};

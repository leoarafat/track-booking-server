import { Request, Response } from 'express';
import catchAsync from '../../../shared/catchasync';
import { DashboardOverviewService } from './overview.service';
import sendResponse from '../../../shared/sendResponse';

const totalUserAndEarning = catchAsync(async (req: Request, res: Response) => {
  const result = await DashboardOverviewService.totalUserAndEarning();
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Success',
    data: result,
  });
});
const Analytics = catchAsync(async (req: Request, res: Response) => {
  const result = await DashboardOverviewService.Analytics();
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Success',
    data: result,
  });
});
const purchasedPackageList = catchAsync(async (req: Request, res: Response) => {
  const result = await DashboardOverviewService.purchasedPackageList(req.query);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Success',
    data: result,
  });
});

export const DashboardOverviewController = {
  totalUserAndEarning,
  Analytics,
  purchasedPackageList,
};

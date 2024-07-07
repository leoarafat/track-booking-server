import { Request, RequestHandler, Response } from 'express';
import { RattingService } from './rattings.service';
import catchAsync from '../../../shared/catchasync';
import sendResponse from '../../../shared/sendResponse';

const insertIntoDB: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const result = await RattingService.insertIntoDB(req);
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: `Ratting send successfully`,
      data: result,
    });
  },
);
const averageRattingForDriver: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const result = await RattingService.averageRattingForDriver(req);
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: `Ratting retrieved successfully`,
      data: result,
    });
  },
);

export const RattingController = {
  insertIntoDB,
  averageRattingForDriver,
};

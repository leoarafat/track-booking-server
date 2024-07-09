import { Request, Response } from 'express';
import catchAsync from '../../../shared/catchasync';
import sendResponse from '../../../shared/sendResponse';

import { TripService } from './trip.service';

const insertIntoDB = catchAsync(async (req: Request, res: Response) => {
  const result = await TripService.insertIntoDB(req);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Request Send Successful',
    data: result,
  });
});

const myTrip = catchAsync(async (req: Request, res: Response) => {
  const result = await TripService.myTrip(req);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Trip retrieved successfully',
    data: result,
  });
});
const usersTrip = catchAsync(async (req: Request, res: Response) => {
  const result = await TripService.usersTrip(req);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Trip retrieved successfully',
    data: result,
  });
});
const myTripRequests = catchAsync(async (req: Request, res: Response) => {
  const result = await TripService.myTripRequests(req);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Trip retrieved successfully',
    data: result,
  });
});
const acceptTrip = catchAsync(async (req: Request, res: Response) => {
  const result = await TripService.acceptTrip(req);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Trip accept successfully',
    data: result,
  });
});
const endTrip = catchAsync(async (req: Request, res: Response) => {
  const result = await TripService.endTrip(req);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Trip End successfully',
    data: result,
  });
});
const cancelTrip = catchAsync(async (req: Request, res: Response) => {
  const result = await TripService.cancelTrip(req);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Trip Canceled successfully',
    data: result,
  });
});
const searchTrip = catchAsync(async (req: Request, res: Response) => {
  const result = await TripService.searchTrip();
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Trip retrieved successfully',
    data: result,
  });
});
const searchTripDetails = catchAsync(async (req: Request, res: Response) => {
  const result = await TripService.searchTripDetails(req.params.id);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Trip retrieved successfully',
    data: result,
  });
});
export const TripController = {
  insertIntoDB,
  myTrip,
  acceptTrip,
  myTripRequests,
  searchTrip,
  usersTrip,
  endTrip,
  cancelTrip,
  searchTripDetails,
};

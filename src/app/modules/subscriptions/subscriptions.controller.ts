import { Request, Response } from 'express';
import catchAsync from '../../../shared/catchasync';
import sendResponse from '../../../shared/sendResponse';
import { SubscriptionService } from './subscriptions.service';

const upgradeSubscription = catchAsync(async (req: Request, res: Response) => {
  const user = req.user;
  const { ...subscriptionData } = req.body;
  const result = await SubscriptionService.upgradeSubscriptionToDB(
    user!,
    subscriptionData,
  );
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Plan upgrade successful',
    data: result,
  });
});

const mySubscription = catchAsync(async (req: Request, res: Response) => {
  const user = req.user;
  const result = await SubscriptionService.mySubscriptionFromDB(user!);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Plan retrieved successful',
    data: result,
  });
});

export const SubscriptionController = {
  upgradeSubscription,
  mySubscription,
};

import { Request, Response } from 'express';
import catchAsync from '../../../shared/catchasync';
import sendResponse from '../../../shared/sendResponse';
import { SubscriptionsPlanService } from './subscriptions-plan.service';

const createSubscriptionPlan = catchAsync(
  async (req: Request, res: Response) => {
    const result = await SubscriptionsPlanService.createSubscriptionPlanToDB(
      req.body,
    );
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: 'Subscription plan created successfully',
      data: result,
    });
  },
);

const getAllSubscriptionPlan = catchAsync(
  async (req: Request, res: Response) => {
    const result =
      await SubscriptionsPlanService.getAllSubscriptionPlanFromDB();

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: 'Subscription plan retrieved successfully',
      data: result,
    });
  },
);

const updateSubscriptionPlan = catchAsync(
  async (req: Request, res: Response) => {
    const id = req.params.id;
    const result = await SubscriptionsPlanService.updateSubscriptionPlanToDB(
      id,
      req.body,
    );
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: 'Subscription plan updated successfully',
      data: result,
    });
  },
);

export const SubscriptionsPlanController = {
  createSubscriptionPlan,
  getAllSubscriptionPlan,
  updateSubscriptionPlan,
};

import httpStatus from 'http-status';
import { model, Schema } from 'mongoose';
import { packageName } from '../../../constants/subscription.name';
import ApiError from '../../../errors/ApiError';
import {
  IPackageDetails,
  ISubscriptionPlan,
  SubscriptionPlanModel,
} from './subscriptions-plan.interface';

const packageDetailSchema = new Schema<IPackageDetails>(
  {
    title: {
      type: String,
    },
    status: {
      type: Boolean,
      default: false,
    },
  },
  { _id: false },
);

const subscriptionPlanSchema = new Schema<
  ISubscriptionPlan,
  SubscriptionPlanModel
>(
  {
    packageName: {
      type: String,
      enum: packageName,
      required: true,
    },
    packagePrice: {
      type: Number,
      required: true,
    },
    packageDuration: {
      type: Number,
      required: true,
    },
    trainingVideo: {
      type: packageDetailSchema,
    },
    communityGroup: {
      type: packageDetailSchema,
    },
    videoLesson: {
      type: packageDetailSchema,
    },
    chat: {
      type: packageDetailSchema,
    },
    program: {
      type: packageDetailSchema,
    },
  },
  { timestamps: true },
);

subscriptionPlanSchema.pre('save', async function (next) {
  const isExist = await SubscriptionPlan.findOne({
    packageName: this.packageName,
  });
  if (isExist) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      'Subscription plan already exist!',
    );
  }
  next();
});

export const SubscriptionPlan = model<ISubscriptionPlan, SubscriptionPlanModel>(
  'SubscriptionPlan',
  subscriptionPlanSchema,
);

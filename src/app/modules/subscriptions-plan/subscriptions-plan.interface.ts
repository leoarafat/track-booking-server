import { Model } from 'mongoose';

export type IPackageDetails = { title: string; status: boolean };

export type ISubscriptionPlan = {
  packageName: 'Basic' | 'Standard' | 'Premium';
  packagePrice: number;
  packageDuration: number;
  trainingVideo?: IPackageDetails;
  communityGroup?: IPackageDetails;
  videoLesson?: IPackageDetails;
  chat?: IPackageDetails;
  program?: IPackageDetails;
};

export type SubscriptionPlanModel = Model<
  ISubscriptionPlan,
  Record<string, unknown>
>;

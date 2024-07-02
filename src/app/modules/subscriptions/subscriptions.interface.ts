import { Types } from 'mongoose';
type SubscriptionPaymentStatus = 'paid' | 'unpaid' | 'trail';
type SubscriptionState = 'active' | 'inactive';

export type ISubscription = {
  user_id: Types.ObjectId;
  plan_id: Types.ObjectId;
  startDate: Date;
  endDate: Date;
  payment_status: SubscriptionPaymentStatus;
  status: SubscriptionState;
  transaction_id: string;
  amount: string;
  plan_type: 'Basic' | 'Standard' | 'Premium';
};

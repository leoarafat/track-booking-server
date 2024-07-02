import { Schema, model } from 'mongoose';
import { ISubscription } from './subscriptions.interface';

const subscriptionSchema = new Schema<ISubscription>(
  {
    user_id: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    plan_id: {
      type: Schema.Types.ObjectId,
      ref: 'SubscriptionPlan',
      required: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    payment_status: {
      type: String,
      required: true,
      enum: ['paid', 'unpaid', 'trail'],
      default: 'unpaid',
    },
    status: {
      type: String,
      required: true,
      enum: ['active', 'inactive'],
      default: 'active',
    },
    plan_type: {
      type: String,
      required: true,
      enum: ['Basic', 'Standard', 'Premium'],
    },
    transaction_id: {
      type: String,
      required: true,
    },
    amount: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

export const Subscription = model('Subscription', subscriptionSchema);

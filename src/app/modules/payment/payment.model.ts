import { Schema, model } from 'mongoose';
import { IPayment } from './payment.interface';

const paymentSchema = new Schema<IPayment>(
  {
    payment_method: String,
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    plan_id: {
      type: Schema.Types.ObjectId,
      ref: 'Subscription',
    },
    amount: Number,
    transaction_id: String,
    note: String,
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
  },
);

export const Payment = model('Payment', paymentSchema);

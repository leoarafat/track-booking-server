import { Schema } from 'mongoose';

export type IPayment = {
  payment_method: string;
  user: Schema.Types.ObjectId;
  plan_id: Schema.Types.ObjectId;
  amount: number;
  transaction_id: string;
  note: string;
};

import { z } from 'zod';

const post = z.object({
  body: z.object({
    plan_id: z.string({ required_error: 'planId is required' }),
    transaction_id: z.string({ required_error: 'transactionId is required' }),
    amount: z.string({ required_error: 'Price is required' }),
  }),
});

export const SubscriptionsValidation = { post };

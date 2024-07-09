import { z } from 'zod';

const createTrip = z.object({
  body: z.object({
    driver: z.string({
      required_error: 'Driver ID is required',
    }),
    pickup: z.string({
      required_error: 'Pickup location is required',
    }),
    from: z.string({
      required_error: 'From is required',
    }),
    to: z.string({
      required_error: 'to is required',
    }),
    time: z.string({
      required_error: 'From is required',
    }),
    tripType: z.string({
      required_error: 'tripType is required',
    }),
    distance: z.string({
      required_error: 'Distance is required',
    }),
    amount: z.number({
      required_error: 'Amount is required',
    }),
    fee: z.number({
      required_error: 'Fee is required',
    }),
    acceptStatus: z.enum(['pending', 'accepted']).default('pending'),
  }),
});

export const TripValidation = {
  createTrip,
};

import { z } from 'zod';

const create = z.object({
  body: z.object({
    driver: z.string({
      required_error: 'driver is required',
    }),
    ratting: z.number({
      required_error: 'ratting is required',
    }),
  }),
});

export const RattingValidation = {
  create,
};

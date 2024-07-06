import { z } from 'zod';

const messages = z.object({
  body: z.object({
    message: z.string({ required_error: 'Message is required' }),
  }),
});

export const MessageValidation = { messages };

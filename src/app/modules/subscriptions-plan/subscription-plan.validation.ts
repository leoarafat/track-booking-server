import { z } from 'zod';
import { packageName } from '../../../constants/subscription.name';

const CreateSubscriptionPlanZodSchema = z.object({
  body: z.object({
    packageName: z.enum([...packageName] as [string, ...string[]], {
      required_error: 'Package name is required',
    }),
    packagePrice: z.number({ required_error: 'Package Price is required' }),
    packageDuration: z.number({
      required_error: 'Package Duration is required',
    }),
    trainingVideo: z
      .object({
        title: z.string({
          required_error: 'Training videos title is required',
        }),
        status: z.boolean().default(false),
      })
      .optional(),
    communityGroup: z
      .object({
        title: z.string({
          required_error: 'Community group title is required',
        }),
        status: z.boolean().default(false),
      })
      .optional(),
    videoLesson: z
      .object({
        title: z.string({
          required_error: 'Video lesson title is required',
        }),
        status: z.boolean().default(false),
      })
      .optional(),
    chat: z
      .object({
        title: z.string({
          required_error: 'Chat title is required',
        }),
        status: z.boolean().default(false),
      })
      .optional(),
    program: z
      .object({
        title: z.string({
          required_error: 'Program title is required',
        }),
        status: z.boolean().default(false),
      })
      .optional(),
  }),
});

const updateSubscriptionPlanZodSchema = z.object({
  body: z.object({
    packageName: z.enum([...packageName] as [string, ...string[]]).optional(),
    packagePrice: z.number().optional(),
    packageDuration: z.number().optional(),
    packageDetails: z
      .array(
        z.object({
          title: z.string().optional(),
          status: z.boolean().optional(),
        }),
      )
      .nonempty()
      .optional(),
  }),
});

export const SubscriptionPlanValidation = {
  CreateSubscriptionPlanZodSchema,
  updateSubscriptionPlanZodSchema,
};

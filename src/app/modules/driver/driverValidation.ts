import { z } from 'zod';

const createDriverSchema = z.object({
  body: z.object({
    name: z
      .string({
        required_error: 'Name is required',
      })
      .min(1, 'Name cannot be empty'),
    phoneNumber: z.string({
      required_error: 'Phone number is required',
    }),
    email: z
      .string({
        required_error: 'Email is required',
      })
      .email('Invalid email format'),
    password: z.string({
      required_error: 'Password is required',
    }),
    drivingLicenseNumber: z.string({
      required_error: 'Driving license number is required',
    }),

    truckRegistrationNumber: z.string({
      required_error: 'Truck registration number is required',
    }),

    kmForPrice: z.string({
      required_error: 'Km for price is required',
    }),
    price: z.string({
      required_error: 'Price is required',
    }),
    bankAccountNumber: z.string({
      required_error: 'Bank account number is required',
    }),
    bankName: z.string({
      required_error: 'Bank name is required',
    }),
    routingNumber: z.string({
      required_error: 'Routing number is required',
    }),
    accountHolderName: z.string({
      required_error: 'Account holder name is required',
    }),
  }),
  files: z.object({
    licenseFrontImage: z
      .array(
        z.object({}).refine(() => true, {
          message: 'licenseFrontImage is required',
        }),
      )
      .nonempty({ message: 'licenseFrontImage array cannot be empty' }),
    licenseBackImage: z
      .array(
        z.object({}).refine(() => true, {
          message: 'licenseBackImage is required',
        }),
      )
      .nonempty({ message: 'licenseBackImage array cannot be empty' }),
    truckDocumentImage: z
      .array(
        z.object({}).refine(() => true, {
          message: 'truckDocumentImage is required',
        }),
      )
      .nonempty({ message: 'truckDocumentImage array cannot be empty' }),
    truckImage: z
      .array(
        z.object({}).refine(() => true, {
          message: 'truckImage is required',
        }),
      )
      .nonempty({ message: 'truckImage array cannot be empty' }),
  }),
});

// Schema for updating driver information
const updateDriverSchema = z.object({
  body: z.object({
    name: z
      .object({
        firstName: z.string().optional(),
        lastName: z.string().optional(),
      })
      .optional(),
    phoneNumber: z.string().optional(),

    password: z.string().optional(),
    drivingLicenseNumber: z.string().optional(),
    drivingLicenseExpireDate: z.date().optional(),
    truckRegistrationNumber: z.string().optional(),
    truckSize: z.string().optional(),
    truckType: z.string().optional(),
    cargoCapacity: z.string().optional(),
    kmForPrice: z.string().optional(),
    price: z.string().optional(),
    bankAccountNumber: z.string().optional(),
    bankName: z.string().optional(),
    routingNumber: z.string().optional(),
    accountHolderName: z.string().optional(),
    address: z.string().optional(),
    role: z.string().optional(),
  }),
});

const loginDriverSchema = z.object({
  body: z.object({
    email: z
      .string({
        required_error: 'Email is required',
      })
      .email('Invalid email format'),
    password: z.string({
      required_error: 'Password is required',
    }),
  }),
});

const refreshTokenDriverSchema = z.object({
  cookies: z.object({
    refreshToken: z.string({
      required_error: 'Refresh Token is required',
    }),
  }),
});

export const DriverValidation = {
  createDriverSchema,
  updateDriverSchema,
  loginDriverSchema,
  refreshTokenDriverSchema,
};

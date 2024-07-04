import { z } from 'zod';

const FileObject = z.object({
  fieldname: z.string(),
  originalname: z.string(),
  encoding: z.string(),
  mimetype: z.string(),
  size: z.number(),
  filename: z.string(),
  path: z.string(),
  buffer: z.instanceof(Buffer),
});

// Schema for creating a driver
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
    drivingLicenseExpireDate: z.date({
      required_error: 'Driving license expiry date is required',
    }),
    licenseFrontImage: FileObject,
    licenseBackImage: FileObject,
    truckRegistrationNumber: z.string({
      required_error: 'Truck registration number is required',
    }),
    truckDocumentImage: FileObject,
    truckImage: FileObject,
    truckSize: z.string({
      required_error: 'Truck size is required',
    }),
    truckType: z.string({
      required_error: 'Truck type is required',
    }),
    cargoCapacity: z.string({
      required_error: 'Cargo capacity is required',
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
});
// const createDriverSchema = z.object({
//   body: z.object({
//     name: z
//       .string({
//         required_error: 'Name is required',
//       })
//       .min(1, 'Name cannot be empty'),
//     phoneNumber: z.string({
//       required_error: 'Phone number is required',
//     }),
//     email: z
//       .string({
//         required_error: 'Email is required',
//       })
//       .email('Invalid email format'),
//     password: z.string({
//       required_error: 'Password is required',
//     }),
//     drivingLicenseNumber: z.string({
//       required_error: 'Driving license number is required',
//     }),
//     drivingLicenseExpireDate: z.date({
//       required_error: 'Driving license expiry date is required',
//     }),
//     truckRegistrationNumber: z.string({
//       required_error: 'Truck registration number is required',
//     }),
//     truckSize: z.string({
//       required_error: 'Truck size is required',
//     }),
//     truckType: z.string({
//       required_error: 'Truck type is required',
//     }),
//     cargoCapacity: z.string({
//       required_error: 'Cargo capacity is required',
//     }),
//     kmForPrice: z.string({
//       required_error: 'Km for price is required',
//     }),
//     price: z.string({
//       required_error: 'Price is required',
//     }),
//     bankAccountNumber: z.string({
//       required_error: 'Bank account number is required',
//     }),
//     bankName: z.string({
//       required_error: 'Bank name is required',
//     }),
//     routingNumber: z.string({
//       required_error: 'Routing number is required',
//     }),
//     accountHolderName: z.string({
//       required_error: 'Account holder name is required',
//     }),
//   }),
// });

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

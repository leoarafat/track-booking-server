import mongoose, { Schema } from 'mongoose';
import { DriverModel, IDriver } from './driver.interface';
import config from '../../../config';
import bcrypt from 'bcrypt';
const driverSchema = new Schema<IDriver>(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },

    role: {
      type: String,
      default: 'DRIVER',
    },
    phoneNumber: {
      type: String,
      required: true,
    },
    drivingLicenseNumber: {
      type: String,
      required: true,
    },
    drivingLicenseExpireDate: {
      type: Date,
      required: true,
    },
    profile_image: {
      type: String,
      default:
        'https://res.cloudinary.com/arafatleo/image/upload/v1720600946/images_1_dz5srb.png',
    },
    licenseFrontImage: {
      type: String,
      required: true,
    },
    licenseBackImage: {
      type: String,
      required: true,
    },
    truckRegistrationNumber: {
      type: String,
      required: true,
    },
    truckDocumentImage: {
      type: String,
      required: true,
    },
    truckImage: {
      type: String,
      required: true,
    },
    truckSize: {
      type: String,
      // required: true,
    },
    truckType: {
      type: String,
      // required: true,
    },
    cargoCapacity: {
      type: String,
      // required: true,
    },
    services: {
      type: [String],
      required: true,
    },
    kmForPrice: {
      type: String,
      required: true,
    },
    price: {
      type: String,
      required: true,
    },
    bankAccountNumber: {
      type: String,
      required: true,
    },
    bankName: {
      type: String,
      required: true,
    },
    routingNumber: {
      type: String,
      required: true,
    },
    accountHolderName: {
      type: String,
      required: true,
    },
    verifyCode: {
      type: String,
    },
    activationCode: {
      type: String,
    },
    verifyExpire: {
      type: Date,
    },
    expirationTime: { type: Date, default: () => Date.now() + 2 * 60 * 1000 },
    isActive: {
      type: Boolean,
      default: false,
    },
    is_block: {
      type: Boolean,
      default: false,
    },
  },

  {
    timestamps: true,
  },
);
driverSchema.statics.isDriverExist = async function (
  email: string,
): Promise<Pick<IDriver, '_id' | 'password' | 'phoneNumber' | 'role'> | null> {
  return await Driver.findOne(
    { email },
    {
      _id: 1,
      email: 1,
      password: 1,
      role: 1,
      phoneNumber: 1,
    },
  );
};

driverSchema.statics.isPasswordMatched = async function (
  givenPassword: string,
  savedPassword: string,
): Promise<boolean> {
  return await bcrypt.compare(givenPassword, savedPassword);
};

driverSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }

  this.password = await bcrypt.hash(
    this.password,
    Number(config.bcrypt_salt_rounds),
  );
  next();
});

const Driver = mongoose.model<IDriver, DriverModel>('Driver', driverSchema);

export default Driver;

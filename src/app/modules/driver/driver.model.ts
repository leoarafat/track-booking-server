import mongoose, { Schema } from 'mongoose';
import { IDriver } from './driver.interface';

const driverSchema = new Schema<IDriver>({
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
  image: {
    type: String,
    required: true,
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
    required: true,
  },
  truckType: {
    type: String,
    required: true,
  },
  cargoCapacity: {
    type: String,
    required: true,
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
});

const Driver = mongoose.model<IDriver>('Driver', driverSchema);

export default Driver;

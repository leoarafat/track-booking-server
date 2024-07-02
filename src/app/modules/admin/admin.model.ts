import { Schema, model } from 'mongoose';
import bcrypt from 'bcrypt';
import config from '../../../config';
import { AdminModel, IAdmin } from './admin.interface';

const AdminSchema = new Schema<IAdmin, AdminModel>(
  {
    name: {
      type: String,

      required: true,
    },
    user_name: {
      type: String,
      unique: true,
      sparse: true,
      // required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    phone_number: {
      type: String,
      unique: true,
      sparse: true,
    },
    password: {
      type: String,
      required: true,
      select: 0,
    },
    address: {
      type: String,
    },

    gender: {
      type: String,
      enum: ['male', 'female', 'others'],
    },

    date_of_birth: {
      type: Date,
    },
    profile_image: {
      type: String,
      default:
        'https://st3.depositphotos.com/15648834/17930/v/450/depositphotos_179308454-stock-illustration-unknown-person-silhouette-glasses-profile.jpg',
    },

    verifyCode: {
      type: String,
    },

    verifyExpire: {
      type: Date,
    },
    role: {
      type: String,
      enum: ['ADMIN', 'SUPER_ADMIN'],
      default: 'ADMIN',
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
  },
);

AdminSchema.statics.isAdminExist = async function (
  email: string,
): Promise<Pick<IAdmin, '_id' | 'password' | 'phone_number' | 'role'> | null> {
  return await Admin.findOne(
    { email },
    {
      _id: 1,
      email: 1,
      password: 1,
      role: 1,
      phone_number: 1,
    },
  );
};

// Check password match
AdminSchema.statics.isPasswordMatched = async function (
  givenPassword: string,
  savedPassword: string,
): Promise<boolean> {
  return await bcrypt.compare(givenPassword, savedPassword);
};

// Hash the password
AdminSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }

  this.password = await bcrypt.hash(
    this.password,
    Number(config.bcrypt_salt_rounds),
  );
  next();
});

// Statics
const Admin = model<IAdmin, AdminModel>('Admin', AdminSchema);

export default Admin;

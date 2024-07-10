import { Schema, model } from 'mongoose';
import { IUser, UserModel } from './user.interface';
import bcrypt from 'bcrypt';
import config from '../../../config';
import validator from 'validator';

const UserSchema = new Schema<IUser, UserModel>(
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
      required: [true, 'Email is required'],
      unique: true,
      validate: {
        validator: (value: string) => validator.isEmail(value),
        message: 'Please provide a valid email address',
      },
    },
    phone_number: {
      type: String,

      // required: true,
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      select: false,
    },
    address: {
      type: String,
    },
    role: {
      type: String,
      enum: ['ADMIN', 'SUPER_ADMIN', 'USER'],
      default: 'USER',
    },

    age: {
      type: String,
    },
    profile_image: {
      type: String,
      default:
        'https://res.cloudinary.com/arafatleo/image/upload/v1720600946/images_1_dz5srb.png',
    },

    location: {
      type: String,
    },

    date_of_birth: {
      type: Date,
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
    is_block: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
  },
);

// Create a unique index for phoneNumber field
// Check if User exists
UserSchema.statics.isUserExist = async function (
  email: string,
): Promise<Pick<IUser, '_id' | 'password' | 'phone_number' | 'role'> | null> {
  return await User.findOne(
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
UserSchema.statics.isPasswordMatched = async function (
  givenPassword: string,
  savedPassword: string,
): Promise<boolean> {
  return await bcrypt.compare(givenPassword, savedPassword);
};

// Hash the password
UserSchema.pre('save', async function (next) {
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
const User = model<IUser, UserModel>('User', UserSchema);

export default User;

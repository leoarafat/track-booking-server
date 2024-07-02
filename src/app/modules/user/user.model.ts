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

      required: true,
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
    gender: {
      type: String,
      enum: ['Male', 'Female', 'Others'],
      // required: true,
    },
    age: {
      type: String,
    },
    profile_image: {
      type: String,
      default:
        'https://png.pngtree.com/png-clipart/20230513/ourmid/pngtree-smile-dog-on-white-background-png-image_7096061.png',
    },
    cover_image: {
      type: String,
      default:
        'https://images.unsplash.com/photo-1504805572947-34fad45aed93?q=80&w=1000&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8Y292ZXIlMjBwaG90b3xlbnwwfHwwfHx8MA%3D%3D',
    },
    isPaid: {
      type: Boolean,
      default: false,
    },
    location: {
      type: String,
    },
    bio: {
      type: String,
    },
    education: {
      type: String,
    },
    language: {
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
    is_block: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: false,
    },
    plan_type: {
      type: String,
      enum: ['silver', 'gold', 'premium'],
    },
    isSubscribed: {
      type: Boolean,
      default: false,
    },
    expirationTime: { type: Date, default: () => Date.now() + 2 * 60 * 1000 },
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

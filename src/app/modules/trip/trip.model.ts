import mongoose, { Schema } from 'mongoose';
import { ITrip } from './trip.interface';

const TripSchema = new mongoose.Schema<ITrip>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    driver: {
      type: Schema.Types.ObjectId,
      ref: 'Driver',
      required: true,
    },
    pickup: {
      type: String,
      required: true,
    },
    from: {
      type: String,
      required: true,
    },
    to: {
      type: String,
      required: true,
    },
    tripType: {
      type: String,
      enum: ['single', 'round', 'alDay'],
      required: true,
    },
    time: {
      type: String,
      required: true,
    },
    distance: {
      type: String,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    fee: {
      type: Number,
      required: true,
    },
    acceptStatus: {
      type: String,
      enum: ['pending', 'accepted', 'end', 'cancel'],
      default: 'pending',
    },
  },
  { timestamps: true },
);

const Trip = mongoose.model('Trip', TripSchema);

export default Trip;

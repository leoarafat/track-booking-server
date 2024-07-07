import { model, Schema } from 'mongoose';

const rattingSchema = new Schema(
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
    ratting: {
      type: Number,

      required: true,
    },
  },
  {
    timestamps: true,
  },
);

export const Ratting = model('Ratting', rattingSchema);

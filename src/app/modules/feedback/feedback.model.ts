import mongoose, { model, Schema } from 'mongoose';

const replySchema = new mongoose.Schema(
  {
    text: {
      type: String,
    },
    status: {
      type: String,
      enum: ['pending', 'replied'],
      default: 'pending',
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
  },
);

const feedbackSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'Driver',
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    reply: replySchema,
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
  },
);

export const FeedBack = model('FeedBack', feedbackSchema);

import mongoose, { model } from 'mongoose';

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
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    topic: {
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

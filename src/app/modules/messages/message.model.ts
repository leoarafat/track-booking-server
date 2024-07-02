import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema(
  {
    sender: {
      type: String,
      enum: ['user', 'support'],
      required: true,
    },

    conversationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Conversation',
      required: true,
    },
    image: {
      type: String,
    },

    message: {
      type: String,
    },
    messageType: {
      type: String,
      enum: ['text', 'image', 'both', 'video'],
      required: true,
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
  },
);

const Message = mongoose.model('Message', messageSchema);

export default Message;

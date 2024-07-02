/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Request } from 'express';
import Conversation from './conversation.model';
import Message from './message.model';
import { IReqUser } from '../user/user.interface';

const createConversation = async (req: Request) => {
  const { userId } = req.user as IReqUser;
  let result;

  const isExistParticipant = await Conversation.findOne({
    participants: userId,
  });
  result = isExistParticipant;

  if (!isExistParticipant) {
    result = await Conversation.create({ participants: userId });
  }

  return result;
};

//!
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const sendMessage = async (payload: any) => {
  const result = await Message.create(payload);

  //@ts-ignore
  const socketIO = global.io;
  if (socketIO) {
    socketIO.emit(`message::${payload.conversationId}`, result);
  }

  return result;
};

const getMessages = async (id: string) => {
  /* const page = Number(pages || 1);
  const limit = Number(limits || 10);
  const skip = (page - 1) * limit; */

  const conversation = await Message.find({ conversationId: id });

  /* const total = await Message.countDocuments({ conversationId: id });

  const totalPage = Math.ceil(total / limit);
  const messages = conversation; */

  return conversation;
};
//!

const conversationUser = async () => {
  const messageConversations = await Message.distinct('conversationId');

  const conversationsWithMessages = await Conversation.find({
    _id: { $in: messageConversations },
  }).populate({
    path: 'participants',
    select: '_id name email role profile_image',
  });

  return conversationsWithMessages;
};

export const messageService = {
  sendMessage,
  getMessages,
  conversationUser,
  createConversation,
};

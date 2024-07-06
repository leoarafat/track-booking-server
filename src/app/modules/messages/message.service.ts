/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Request, Response } from 'express';
import Conversation from './conversation.model';
import Message from './message.model';
import ApiError from '../../../errors/ApiError';
import User from '../user/user.model';
import Driver from '../driver/driver.model';

//* One to one conversation
const sendMessage = async (req: Request) => {
  const { id: receiverId } = req.params;
  const senderId = req.user?.userId;
  const data = req.body;

  const { message } = data;

  if (receiverId === null || senderId === null) {
    throw new ApiError(404, 'Sender or Receiver user not found');
  }

  let conversation = await Conversation.findOne({
    participants: { $all: [senderId, receiverId] },
  });

  if (!conversation) {
    conversation = await Conversation.create({
      participants: [senderId, receiverId],
    });

    const newMessage = new Message({
      senderId,
      receiverId,
      message,
      conversationId: conversation._id,
    });

    if (newMessage) {
      conversation.messages.push(newMessage._id);
    }
    await Promise.all([conversation.save(), newMessage.save()]);
    //@ts-ignore
    const socketIO = global.io;
    if (socketIO && conversation && newMessage) {
      //@ts-ignore
      // socketIO.to(receiverId).emit('getMessage', newMessage);
      socketIO.emit(`message::${conversation._id.toString()}`, newMessage);
    }

    return newMessage;
  }
};

//*
const getMessages = async (req: Request, res: Response) => {
  try {
    const { id: receiverId } = req.params;
    const senderId = req?.user?.userId;
    const conversation = await Conversation.findOne({
      participants: { $all: [senderId, receiverId] },
    }).populate('messages');

    if (!conversation) return res.status(200).json([]);

    const messages = conversation.messages;

    return messages;
  } catch (error) {
    //@ts-ignore
    console.log('Error in getMessages controller: ', error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
};
const conversationUser = async () => {
  // const messageConversations = await Message.distinct('conversationId');

  // const conversationsWithMessages = await Conversation.find({
  //   _id: { $in: messageConversations },
  // }).populate({
  //   path: 'participants',
  //   select: '_id name email role profile_image',
  // });

  // return conversationsWithMessages;
  const messageConversations = await Message.distinct('conversationId');

  const conversations = await Conversation.find({
    _id: { $in: messageConversations },
  });

  const participantIds = [
    ...new Set(conversations.flatMap(convo => convo.participants)),
  ];

  const users = await User.find({
    _id: { $in: participantIds },
  }).select('_id name email role ');

  const drivers = await Driver.find({
    _id: { $in: participantIds },
  }).select('_id name email role ');

  const userMap = users.reduce((acc, user) => {
    //@ts-ignore
    acc[user._id] = { ...user._doc, type: 'User' };
    return acc;
  }, {});

  const driverMap = drivers.reduce((acc, driver) => {
    //@ts-ignore
    acc[driver._id] = { ...driver._doc, type: 'Driver' };
    return acc;
  }, {});

  const participantMap = { ...userMap, ...driverMap };

  const conversationsWithParticipants = conversations.map(convo => ({
    //@ts-ignore
    ...convo._doc,
    participants: convo.participants.map(
      //@ts-ignore
      participantId => participantMap[participantId],
    ),
  }));
  return conversationsWithParticipants;
};
export const messageService = {
  sendMessage,
  getMessages,
  conversationUser,
};

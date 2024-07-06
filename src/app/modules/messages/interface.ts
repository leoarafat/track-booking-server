import { Types } from 'mongoose';
import { IUser } from '../user/user.interface';

export type IConversation = {
  participants: Types.ObjectId[];
  isGroup: boolean;
  groupName: string;
  messages: Types.ObjectId[];
};
export type IMessage = {
  senderId: Types.ObjectId | IUser;
  receiverId: Types.ObjectId | IUser;
  conversationId: Types.ObjectId | IConversation;
  image: string;
  message: string;
};

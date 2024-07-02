import { Request, RequestHandler, Response } from 'express';
import sendResponse from '../../../shared/sendResponse';
import catchAsync from '../../../shared/catchasync';
import { messageService } from './message.service';
import { fileType } from '../../../utils/fileType';

const sendMessage: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const user = req.user;
    const data = req.body;

    const messageData = {
      sender: user?.role === 'USER' ? 'user' : 'support',
      conversationId: data.conversationId,
      image: '',
      message: data.message === undefined ? '' : data.message,
      messageType: 'text',
    };

    if (req.files && 'image' in req.files && req.files.image[0]) {
      messageData.image = `/images/image/${req.files.image[0].filename}`;
      messageData.messageType = fileType(req.files.image[0].mimetype);
    }

    if (
      data.message !== undefined &&
      req.files &&
      'image' in req.files &&
      req.files.image[0]
    ) {
      messageData.messageType = 'both';
    }
    const result = await messageService.sendMessage(messageData);

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: `Message Send`,
      data: result,
    });
  },
);

const getMessages: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const conversationId = req.params.id;
    const result = await messageService.getMessages(conversationId);

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: 'Message retrieved successfully',
      data: result,
    });
  },
);

const conversationUser: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const result = await messageService.conversationUser();

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: 'Conversation Retrieved Successfully',
      data: result,
    });
  },
);

const createConversation: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const result = await messageService.createConversation(req);

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: 'Conversation created Successfully',
      data: result,
    });
  },
);

export const messageController = {
  sendMessage,
  getMessages,
  conversationUser,
  createConversation,
};

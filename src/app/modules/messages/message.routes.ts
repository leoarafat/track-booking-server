import express from 'express';
import auth from '../../middlewares/auth';
import { ENUM_USER_ROLE } from '../../../enums/user';
import { messageController } from './message.controller';
import { uploadFile } from '../../middlewares/fileUploader';

const router = express.Router();

router.post(
  '/create-conversation',
  auth(ENUM_USER_ROLE.USER),
  messageController.createConversation,
);

router.post(
  '/send-message',
  auth(ENUM_USER_ROLE.USER, ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN),
  uploadFile(),
  messageController.sendMessage,
);
router.get(
  '/get-conversation',
  auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN),
  messageController.conversationUser,
);
router.get(
  '/get-message/:id',
  // auth(ENUM_USER_ROLE.USER, ENUM_USER_ROLE.ADMIN),
  messageController.getMessages,
);

export const MessageRoutes = router;

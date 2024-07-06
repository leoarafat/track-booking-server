import express from 'express';
import auth from '../../middlewares/auth';
import { ENUM_USER_ROLE } from '../../../enums/user';
import { messageController } from './message.controller';

import { validateRequest } from '../../middlewares/validateRequest';
import { MessageValidation } from './messages.validation';

const router = express.Router();

router.post(
  '/send-message/:id',

  auth(ENUM_USER_ROLE.USER, ENUM_USER_ROLE.DRIVER),
  validateRequest(MessageValidation.messages),
  messageController.sendMessage,
);
router.get(
  '/get-conversation',
  auth(ENUM_USER_ROLE.USER, ENUM_USER_ROLE.DRIVER),
  messageController.conversationUser,
);
router.get(
  '/get-message/:id',
  auth(ENUM_USER_ROLE.USER, ENUM_USER_ROLE.DRIVER),
  messageController.getMessages,
);

export const MessageRoutes = router;

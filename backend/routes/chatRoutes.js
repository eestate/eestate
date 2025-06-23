import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { startConversation, getMessages, sendMessage, getConversations } from '../controllers/chatController.js';
import { uploadChatImage } from '../middleware/chatUploadMiddleware.js';

const router = express.Router();

router.route('/conversations')
  .get(protect, getConversations)
  .post(protect, startConversation);

router.route('/conversations/:conversationId/messages')
  .get(protect, getMessages)
  .post(protect, uploadChatImage, sendMessage);

  router.post('/conversations/:conversationId/messages/text', protect, sendMessage);

export default router;

import express from 'express';
import {
  getStripeProducts,
  createCheckoutSession,
  handleStripeWebhook,
  cancelSubscription,
  verifySubscription
} from '../controllers/subscriptionController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/products', getStripeProducts);
router.post('/create-checkout-session', createCheckoutSession);
router.post('/cancel', cancelSubscription);
router.post('/verify', verifySubscription);
router.post('/webhook', express.raw({type: 'application/json'}), handleStripeWebhook);

export default router;

// import express from 'express';
// import {
//   createCheckoutSession,
//   handleStripeWebhook,
//   checkListingAvailability,
//   getSubscriptionStatus
// } from '../controllers/subscriptionController.js';
// import { protect, restrictTo } from '../middleware/authMiddleware.js';

// const router = express.Router();

// router.post('/webhook', express.raw({type: 'application/json'}), handleStripeWebhook);

// router.use(protect);

// router.post('/create-session', restrictTo('agent'), createCheckoutSession);

// router.get('/can-list', restrictTo('agent'), checkListingAvailability);

// router.get('/status', restrictTo('agent'), getSubscriptionStatus);

// export default router;


import express from 'express';
import {
  createCheckoutSession,
  handleWebhook,
  getSubscriptionStatus,
  canAddListing,
} from '../controllers/subscriptionController.js';
import { protect } from '../middleware/authMiddleware.js'; 

const router = express.Router();

router.post('/subscription/create-checkout-session', protect, createCheckoutSession);

router.post(
  '/subscription/webhook',
  express.raw({ type: 'application/json' }),
  handleWebhook
);

router.get('/subscription/status', protect, getSubscriptionStatus);

router.get('/subscription/can-add-listing', protect, canAddListing);

export default router;
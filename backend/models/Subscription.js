
import mongoose from 'mongoose';

const subscriptionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    stripeSubscriptionId: {
      type: String,
      required: true,
      unique: true,
    },
    stripeCustomerId: {
      type: String,
      required: true,
    },
    stripePriceId: {
      type: String,
      required: true,
    },
    stripeProductId: {
      type: String,
      required: true,
    },
    planName: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ['active', 'canceled', 'incomplete', 'incomplete_expired', 'past_due', 'unpaid', 'trialing'],
      default: 'incomplete',
    },
    currentPeriodEnd: {
      type: Date,
    },
    cancelAtPeriodEnd: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export default mongoose.model('Subscription', subscriptionSchema); 
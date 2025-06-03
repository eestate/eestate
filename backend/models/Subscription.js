
import mongoose from "mongoose";

const subscriptionSchema = new mongoose.Schema({
  agent: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  planName: {
    type: String,
    enum: ['Basic', 'Pro', 'Enterprise'],
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  listingLimit: {
    type: Number,
    required: true
  },
  usedListings: {
    type: Number,
    default: 0
  },
  startDate: {
    type: Date,
    required: true,
    default: Date.now
  },
  endDate: {
    type: Date
  },
  stripeSubscriptionId: {
    type: String,
    required: true
  },
  stripeCustomerId: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['active', 'expired', 'cancelled'],
    default: 'active'
  }
}, { timestamps: true });

subscriptionSchema.pre('save', function(next) {
  if (this.planName === 'Pro' && !this.endDate) {
    this.endDate = new Date(this.startDate);
    this.endDate.setFullYear(this.endDate.getFullYear() + 1);
  }
  next();
});

subscriptionSchema.methods.canAddListing = function() {
  if (this.status !== 'active') return false;
  if (this.planName === 'Basic' && this.usedListings >= this.listingLimit) return false;
  if (this.endDate && new Date() > this.endDate) return false;
  return true;
};

subscriptionSchema.statics.getPlanConfig = function(planName) {
  const plans = {
    'Basic': { amount: 1000, listingLimit: 5, priceId: process.env.STRIPE_BASIC_PLAN_ID },
    'Pro': { amount: 2000, listingLimit: 20, priceId: process.env.STRIPE_PRO_PLAN_ID },
    'Enterprise': { amount: 5000, listingLimit: Infinity, priceId: process.env.STRIPE_ENTERPRISE_PLAN_ID }
  };
  return plans[planName];
};

export default mongoose.model('Subscription', subscriptionSchema);
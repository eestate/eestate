
import Stripe from 'stripe';
import User from '../models/User.js';
import Subscription from '../models/Subscription.js';
import asyncHandler from 'express-async-handler';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const createCheckoutSession = asyncHandler(async (req, res) => {
  const { planName } = req.body;
  const agent = req.user; 

  if (!agent || agent.role !== 'agent') {
    return res.status(403).json({ message: 'Only agents can subscribe' });
  }

  const planConfig = Subscription.getPlanConfig(planName);
  if (!planConfig) {
    return res.status(400).json({ message: 'Invalid plan type' });
  }

  const session = await stripe.checkout.sessions.create({
    customer_email: agent.email,
    payment_method_types: ['card'],
    line_items: [
      {
        price: planConfig.priceId,
        quantity: 1,
      },
    ],
    mode: 'subscription',
    success_url: `${process.env.CLIENT_URL}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.CLIENT_URL}/payment-cancel`,
    metadata: {
      agentId: agent._id.toString(),
      planName,
      listingLimit: planConfig.listingLimit.toString(),
      amount: planConfig.amount,
    },
  });

  res.json({ id: session.id });
});

export const handleWebhook = asyncHandler(async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const { agentId, planName, listingLimit, amount } = session.metadata;

    const user = await User.findById(agentId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const subscription = new Subscription({
      agent: agentId,
      planName,
      amount: parseInt(amount),
      listingLimit: parseInt(listingLimit),
      usedListings: 0,
      startDate: new Date(),
      stripeSubscriptionId: session.subscription,
      stripeCustomerId: session.customer,
      status: 'active',
    });

    if (planName === 'Pro') {
      subscription.endDate = new Date();
      subscription.endDate.setFullYear(subscription.endDate.getFullYear() + 1);
    }

    await subscription.save();

    user.isSubscribed = true;
    user.subscriptionExpiresAt = subscription.endDate || null;
    await user.save();
  }

  res.json({ received: true });
});

export const getSubscriptionStatus = asyncHandler(async (req, res) => {
  const user = req.user;
  const subscription = await Subscription.findOne({ agent: user._id, status: 'active' });

  if (!subscription) {
    return res.status(404).json({ message: 'No active subscription found' });
  }

  res.json({
    isSubscribed: user.isSubscribed,
    subscription: {
      planName: subscription.planName,
      amount: subscription.amount,
      listingLimit: subscription.listingLimit,
      usedListings: subscription.usedListings,
      startDate: subscription.startDate,
      endDate: subscription.endDate,
      status: subscription.status,
    },
  });
});

export const canAddListing = asyncHandler(async (req, res) => {
  const user = req.user;
  const subscription = await Subscription.findOne({ agent: user._id, status: 'active' });

  if (!subscription) {
    return res.status(404).json({ message: 'No active subscription found' });
  }

  const canAdd = subscription.canAddListing();
  res.json({ canAdd });
});
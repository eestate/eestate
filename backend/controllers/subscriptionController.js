

import stripe from 'stripe';
import Subscription from '../models/Subscription.js';
const stripeInstance = stripe(process.env.STRIPE_SECRET_KEY);

const isValidUnix = (timestamp) => {
  return typeof timestamp === 'number' && !isNaN(timestamp) && timestamp > 0;
};

export const getStripeProducts = async (req, res) => {
  try {
    const products = await stripeInstance.products.list({
      active: true,
      expand: ['data.default_price'],
    });

    const formattedProducts = products.data
      .map((product) => ({
        id: product.id,
        name: product.name,
        description: product.description,
        images: product.images,
        metadata: product.metadata,
        price: product.default_price
          ? {
              id: product.default_price.id,
              unit_amount: product.default_price.unit_amount,
              currency: product.default_price.currency,
              recurring: product.default_price.recurring,
            }
          : null,
      }))
      .filter((product) => product.price);

    res.json(formattedProducts);
  } catch (error) {
    console.error('Error fetching Stripe products:', error);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
};

export const checkSubscriptionStatus = async (req, res) => {
  try {
    const subscription = await Subscription.findOne({
      user: req.user._id,
      status: 'active',
    });

    return res.status(200).json({
      hasActiveSubscription: !!subscription,
      subscription: subscription || null,
    });
  } catch (error) {
    console.error('Subscription check error:', error);
    return res.status(500).json({
      error: 'Server error',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

export const createCheckoutSession = async (req, res) => {
  try {
    const { planName, userId, email } = req.body;

    if (!planName || !userId) {
      return res.status(400).json({ error: 'planName and userId are required' });
    }

    const userIdString = userId.toString();

    const products = await stripeInstance.products.list({
      active: true,
      expand: ['data.default_price'],
    });

    const product = products.data.find((p) => p.name === planName);

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    if (!product.default_price) {
      return res.status(400).json({ error: 'Product does not have a default price' });
    }

    const session = await stripeInstance.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: product.default_price.id,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${process.env.CLIENT_URL}/agent/subscription/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.CLIENT_URL}/payment-canceled`,
      client_reference_id: userIdString, 
      customer_email: email || undefined,
      metadata: {
        product_name: product.name,
        user_id: userIdString,
      },
      subscription_data: {
        metadata: {
          user_id: userIdString, 
        },
      },
    });

    res.json({ url: session.url });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    res.status(500).json({ error: error.message || 'Failed to create checkout session' });
  }
};

export const cancelSubscription = async (req, res) => {
  try {
    const { subscriptionId } = req.body;

    if (!subscriptionId) {
      return res.status(400).json({ error: 'subscriptionId is required' });
    }

    const subscription = await stripeInstance.subscriptions.update(subscriptionId, {
      cancel_at_period_end: true,
    });

    await Subscription.findOneAndUpdate(
      { stripeSubscriptionId: subscriptionId },
      {
        cancelAtPeriodEnd: subscription.cancel_at_period_end,
        currentPeriodEnd: isValidUnix(subscription.current_period_end)
          ? new Date(subscription.current_period_end * 1000)
          : undefined,
        status: subscription.status,
      }
    );

    res.json({
      success: true,
      cancelAtPeriodEnd: subscription.cancel_at_period_end,
      currentPeriodEnd: isValidUnix(subscription.current_period_end)
        ? new Date(subscription.current_period_end * 1000)
        : undefined,
    });
  } catch (error) {
    console.error('Subscription cancellation error:', error);
    res.status(500).json({ error: 'Failed to cancel subscription' });
  }
};

export const verifySubscription = async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ error: 'userId is required' });
    }

    const subscription = await Subscription.findOne({ user: userId, status: 'active' }).lean();

    if (!subscription) {
      return res.json({ isSubscribed: false });
    }

    res.json({
      isSubscribed: true,
      subscriptionType: subscription.planName.toLowerCase(),
      subscriptionId: subscription.stripeSubscriptionId,
      cancelAtPeriodEnd: subscription.cancelAtPeriodEnd || false,
    });
  } catch (error) {
    console.error('Subscription verification error:', error);
    res.status(500).json({ error: 'Failed to verify subscription' });
  }
};

export const handleStripeWebhook = async (req, res) => {
  const sig = req.headers['stripe-signature'];
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event;

  try {
    // Validate req.body is a Buffer
    if (!Buffer.isBuffer(req.body)) {
      console.error('Webhook body is not a Buffer:', typeof req.body);
      return res.status(400).json({ error: 'Invalid webhook payload: Expected raw body' });
    }

    // Log raw body for debugging
    console.log('Webhook raw body:', req.body.toString('utf-8'));
    console.log('Webhook signature:', sig);

    event = stripeInstance.webhooks.constructEvent(req.body, sig, endpointSecret);
    console.log('Webhook event received:', event.type, event.id);
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).json({ error: `Webhook Error: ${err.message}` });
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed':
        await handleCheckoutSessionCompleted(event.data.object);
        break;
      case 'customer.subscription.created':
      case 'customer.subscription.updated':
        await handleSubscriptionUpdated(event.data.object);
        break;
      case 'customer.subscription.deleted':
        await handleSubscriptionDeleted(event.data.object);
        break;
      case 'invoice.paid':
        await handleInvoicePaid(event.data.object);
        break;
      case 'invoice.finalized':
        await handleInvoiceFinalized(event.data.object);
        break;
      case 'invoice.payment_succeeded':
        await handleInvoicePaymentSucceeded(event.data.object);
        break;
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }
    res.json({ received: true });
  } catch (error) {
    console.error('Webhook processing error:', error);
    res.status(500).json({ error: 'Webhook processing failed' });
  }
};
const handleCheckoutSessionCompleted = async (session) => {
  try {
    if (!session.subscription) {
      console.warn('No subscription ID in checkout.session.completed:', session.id);
      return;
    }

    const subscription = await stripeInstance.subscriptions.retrieve(session.subscription);
    
    // Get user ID from multiple possible sources
    const userId = session.client_reference_id || 
                  session.metadata?.user_id || 
                  subscription.metadata?.user_id;

    if (!userId) {
      console.error('No user ID found in session or subscription metadata');
      return;
    }

    await Subscription.findOneAndUpdate(
      { stripeSubscriptionId: session.subscription },
      {
        user: userId, // Ensure this is set
        stripeSubscriptionId: session.subscription,
        stripeCustomerId: session.customer,
        stripePriceId: subscription.items.data[0].price.id,
        stripeProductId: subscription.items.data[0].price.product,
        planName: session.metadata?.product_name || subscription.metadata?.product_name,
        status: subscription.status,
        currentPeriodEnd: isValidUnix(subscription.current_period_end)
          ? new Date(subscription.current_period_end * 1000)
          : undefined,
        cancelAtPeriodEnd: subscription.cancel_at_period_end,
      },
      { upsert: true, new: true }
    );

    console.log('Subscription created/updated for user:', userId);
  } catch (error) {
    console.error('Error handling checkout.session.completed:', error);
    throw error;
  }
};

const handleSubscriptionUpdated = async (subscription) => {
  try {
    const product = await stripeInstance.products.retrieve(subscription.items.data[0].price.product);
    
    // Get user ID from multiple possible sources
    const userId = subscription.metadata?.user_id || 
                  (await getUserIdFromCustomer(subscription.customer));

    if (!userId) {
      console.error('No user ID found for subscription update:', subscription.id);
      return;
    }

    await Subscription.findOneAndUpdate(
      { stripeSubscriptionId: subscription.id },
      {
        user: userId, // Ensure this is set
        stripeCustomerId: subscription.customer,
        stripePriceId: subscription.items.data[0].price.id,
        stripeProductId: subscription.items.data[0].price.product,
        planName: product.name,
        status: subscription.status,
        currentPeriodEnd: isValidUnix(subscription.current_period_end)
          ? new Date(subscription.current_period_end * 1000)
          : undefined,
        cancelAtPeriodEnd: subscription.cancel_at_period_end,
      },
      { upsert: true, new: true }
    );

    console.log('Subscription updated:', subscription.id);
  } catch (error) {
    console.error('Error handling subscription.created/updated:', error);
    throw error;
  }
};


const handleSubscriptionDeleted = async (subscription) => {
  try {
    await Subscription.findOneAndUpdate(
      { stripeSubscriptionId: subscription.id },
      { status: 'canceled' }
    );
    console.log('Subscription deleted:', subscription.id);
  } catch (error) {
    console.error('Error handling subscription.deleted:', error);
    throw error;
  }
};

const handleInvoicePaid = async (invoice) => {
  try {
    if (invoice.subscription) {
      await Subscription.findOneAndUpdate(
        { stripeSubscriptionId: invoice.subscription },
        {
          status: 'active',
          currentPeriodEnd: isValidUnix(invoice.lines.data[0].period.end)
            ? new Date(invoice.lines.data[0].period.end * 1000)
            : undefined,
        }
      );
      console.log('Subscription updated from invoice.paid:', invoice.subscription);
    }
  } catch (error) {
    console.error('Error handling invoice.paid:', error);
    throw error;
  }
};

const handleInvoiceFinalized = async (invoice) => {
  try {
    if (invoice.subscription) {
      await Subscription.findOneAndUpdate(
        { stripeSubscriptionId: invoice.subscription },
        {
          status: invoice.status === 'paid' ? 'active' : invoice.status,
        }
      );
      console.log('Subscription updated from invoice.finalized:', invoice.subscription);
    }
  } catch (error) {
    console.error('Error handling invoice.finalized:', error);
    throw error;
  }
};

const handleInvoicePaymentSucceeded = async (invoice) => {
  try {
    if (invoice.subscription) {
      await Subscription.findOneAndUpdate(
        { stripeSubscriptionId: invoice.subscription },
        {
          status: 'active',
          currentPeriodEnd: isValidUnix(invoice.lines.data[0].period.end)
            ? new Date(invoice.lines.data[0].period.end * 1000)
            : undefined,
        }
      );
      console.log('Subscription updated from invoice.payment_succeeded:', invoice.subscription);
    }
  } catch (error) {
    console.error('Error handling invoice.payment_succeeded:', error);
    throw error;
  }
};

const getUserIdFromCustomer = async (customerId) => {
  try {
    const customer = await stripeInstance.customers.retrieve(customerId);
    return customer.metadata.user_id || null;
  } catch (error) {
    console.error('Error fetching customer:', error);
    return null;
  }
};


export const getActiveSubscriptions = async (req, res) => {
  try {
    const subscriptions = await Subscription.find({ status: 'active' })
      .populate('user', 'name email') 
      .select('user planName stripeSubscriptionId stripeCustomerId stripePriceId stripeProductId status currentPeriodEnd cancelAtPeriodEnd createdAt updatedAt');

    if (!subscriptions || subscriptions.length === 0) {
      return res.status(404).json({ message: 'No active subscriptions found' });
    }

    const formattedSubscriptions = subscriptions.map((sub) => ({
      id: sub._id,
      user: {
        id: sub.user._id,
        name: sub.user.name,
        email: sub.user.email,
      },
      planName: sub.planName,
      stripeSubscriptionId: sub.stripeSubscriptionId,
      stripeCustomerId: sub.stripeCustomerId,
      stripePriceId: sub.stripePriceId,
      stripeProductId: sub.stripeProductId,
      status: sub.status,
      currentPeriodEnd: sub.currentPeriodEnd,
      cancelAtPeriodEnd: sub.cancelAtPeriodEnd,
      createdAt: sub.createdAt,
      updatedAt: sub.updatedAt,
    }));

    res.status(200).json({
      success: true,
      count: subscriptions.length,
      data: formattedSubscriptions,
    });
  } catch (error) {
    console.error('Error fetching active subscriptions:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch active subscriptions' });
  }
};
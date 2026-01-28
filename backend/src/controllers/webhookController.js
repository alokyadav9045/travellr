const asyncHandler = require('../middleware/asyncHandler');
const ApiError = require('../utils/ApiError');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Booking = require('../models/Booking');
const Payment = require('../models/Payment');
const Payout = require('../models/Payout');
const emailService = require('../services/emailService');
const notificationService = require('../services/notificationService');
const logger = require('../utils/logger');

/**
 * @desc    Handle Stripe webhooks
 * @route   POST /api/v1/webhooks/stripe
 * @access  Public (Stripe)
 */
exports.handleStripeWebhook = asyncHandler(async (req, res) => {
  const sig = req.headers['stripe-signature'];
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
  } catch (err) {
    logger.error('Webhook signature verification failed:', err.message);
    throw new ApiError(400, `Webhook Error: ${err.message}`);
  }

  logger.info(`Received Stripe webhook: ${event.type}`);

  // Handle the event
  switch (event.type) {
    case 'payment_intent.succeeded':
      await handlePaymentIntentSucceeded(event.data.object);
      break;

    case 'payment_intent.payment_failed':
      await handlePaymentIntentFailed(event.data.object);
      break;

    case 'charge.refunded':
      await handleChargeRefunded(event.data.object);
      break;

    case 'transfer.created':
      await handleTransferCreated(event.data.object);
      break;

    case 'transfer.failed':
      await handleTransferFailed(event.data.object);
      break;

    case 'account.updated':
      await handleAccountUpdated(event.data.object);
      break;

    case 'checkout.session.completed':
      await handleCheckoutSessionCompleted(event.data.object);
      break;

    default:
      logger.info(`Unhandled event type: ${event.type}`);
  }

  res.json({ received: true });
});

/**
 * Handle successful payment
 */
async function handlePaymentIntentSucceeded(paymentIntent) {
  try {
    const payment = await Payment.findOne({ 
      stripePaymentIntentId: paymentIntent.id 
    });

    if (!payment) {
      logger.error(`Payment not found for PaymentIntent: ${paymentIntent.id}`);
      return;
    }

    payment.status = 'completed';
    payment.paidAt = new Date();
    await payment.save();

    // Update booking
    const booking = await Booking.findById(payment.booking)
      .populate('user', 'name email')
      .populate('trip', 'title')
      .populate('vendor', 'businessName email');

    if (booking) {
      booking.paymentStatus = 'paid';
      booking.status = 'confirmed';
      await booking.save();

      // Send confirmation email
      await emailService.sendBookingConfirmation(booking);

      // Send notification
      await notificationService.sendNotification({
        user: booking.user._id,
        type: 'booking_confirmed',
        title: 'Booking Confirmed',
        message: `Your booking for ${booking.trip.title} has been confirmed!`,
        data: { bookingId: booking._id }
      });

      // Notify vendor
      await notificationService.sendNotification({
        user: booking.vendor.user,
        type: 'new_booking',
        title: 'New Booking Received',
        message: `You have a new booking for ${booking.trip.title}`,
        data: { bookingId: booking._id }
      });

      logger.info(`Payment succeeded for booking ${booking.bookingId}`);
    }
  } catch (error) {
    logger.error('Error handling payment intent succeeded:', error);
  }
}

/**
 * Handle failed payment
 */
async function handlePaymentIntentFailed(paymentIntent) {
  try {
    const payment = await Payment.findOne({ 
      stripePaymentIntentId: paymentIntent.id 
    });

    if (!payment) {
      logger.error(`Payment not found for PaymentIntent: ${paymentIntent.id}`);
      return;
    }

    payment.status = 'failed';
    payment.failureReason = paymentIntent.last_payment_error?.message || 'Payment failed';
    await payment.save();

    // Update booking
    const booking = await Booking.findById(payment.booking)
      .populate('user', 'name email')
      .populate('trip', 'title');

    if (booking) {
      booking.paymentStatus = 'failed';
      booking.status = 'cancelled';
      await booking.save();

      // Send failure notification
      await notificationService.sendNotification({
        user: booking.user._id,
        type: 'payment_failed',
        title: 'Payment Failed',
        message: `Payment for ${booking.trip.title} failed. Please try again.`,
        data: { bookingId: booking._id }
      });

      logger.info(`Payment failed for booking ${booking.bookingId}`);
    }
  } catch (error) {
    logger.error('Error handling payment intent failed:', error);
  }
}

/**
 * Handle charge refunded
 */
async function handleChargeRefunded(charge) {
  try {
    const payment = await Payment.findOne({ 
      stripeChargeId: charge.id 
    });

    if (!payment) {
      logger.error(`Payment not found for Charge: ${charge.id}`);
      return;
    }

    payment.status = 'refunded';
    payment.refundedAmount = charge.amount_refunded / 100;
    payment.refundedAt = new Date();
    await payment.save();

    // Update booking
    const booking = await Booking.findById(payment.booking)
      .populate('user', 'name email')
      .populate('trip', 'title');

    if (booking) {
      booking.paymentStatus = 'refunded';
      booking.status = 'cancelled';
      await booking.save();

      // Send refund notification
      await emailService.sendRefundConfirmation(booking, charge.amount_refunded / 100);

      await notificationService.sendNotification({
        user: booking.user._id,
        type: 'refund_processed',
        title: 'Refund Processed',
        message: `Refund of $${charge.amount_refunded / 100} has been processed for ${booking.trip.title}`,
        data: { bookingId: booking._id }
      });

      logger.info(`Refund processed for booking ${booking.bookingId}`);
    }
  } catch (error) {
    logger.error('Error handling charge refunded:', error);
  }
}

/**
 * Handle transfer created (payout to vendor)
 */
async function handleTransferCreated(transfer) {
  try {
    const payout = await Payout.findOne({ 
      stripeTransferId: transfer.id 
    });

    if (!payout) {
      logger.info(`Payout not found for Transfer: ${transfer.id}`);
      return;
    }

    payout.status = 'processing';
    await payout.save();

    logger.info(`Transfer created for payout ${payout._id}`);
  } catch (error) {
    logger.error('Error handling transfer created:', error);
  }
}

/**
 * Handle transfer failed
 */
async function handleTransferFailed(transfer) {
  try {
    const payout = await Payout.findOne({ 
      stripeTransferId: transfer.id 
    }).populate('vendor', 'businessName email user');

    if (!payout) {
      logger.error(`Payout not found for Transfer: ${transfer.id}`);
      return;
    }

    payout.status = 'failed';
    payout.failureReason = transfer.failure_message || 'Transfer failed';
    await payout.save();

    // Notify vendor
    await notificationService.sendNotification({
      user: payout.vendor.user,
      type: 'payout_failed',
      title: 'Payout Failed',
      message: `Your payout of $${payout.amount} failed. Please update your payment details.`,
      data: { payoutId: payout._id }
    });

    logger.info(`Transfer failed for payout ${payout._id}`);
  } catch (error) {
    logger.error('Error handling transfer failed:', error);
  }
}

/**
 * Handle Stripe Connect account updated
 */
async function handleAccountUpdated(account) {
  try {
    const Vendor = require('../models/Vendor');
    
    const vendor = await Vendor.findOne({ 
      stripeAccountId: account.id 
    });

    if (!vendor) {
      logger.info(`Vendor not found for Account: ${account.id}`);
      return;
    }

    // Update vendor status based on account status
    if (account.charges_enabled && account.payouts_enabled) {
      vendor.stripeAccountStatus = 'active';
    } else if (account.requirements?.currently_due?.length > 0) {
      vendor.stripeAccountStatus = 'restricted';
    }

    await vendor.save();

    logger.info(`Account updated for vendor ${vendor._id}`);
  } catch (error) {
    logger.error('Error handling account updated:', error);
  }
}

/**
 * Handle checkout session completed
 */
async function handleCheckoutSessionCompleted(session) {
  try {
    const bookingId = session.metadata?.bookingId;

    if (!bookingId) {
      logger.error('No bookingId in session metadata');
      return;
    }

    const booking = await Booking.findById(bookingId)
      .populate('user', 'name email')
      .populate('trip', 'title')
      .populate('vendor', 'businessName');

    if (!booking) {
      logger.error(`Booking not found: ${bookingId}`);
      return;
    }

    // Create payment record
    await Payment.create({
      booking: booking._id,
      user: booking.user._id,
      amount: session.amount_total / 100,
      currency: session.currency,
      paymentMethod: 'stripe',
      stripePaymentIntentId: session.payment_intent,
      status: 'completed',
      paidAt: new Date()
    });

    booking.paymentStatus = 'paid';
    booking.status = 'confirmed';
    await booking.save();

    // Send confirmation
    await emailService.sendBookingConfirmation(booking);

    logger.info(`Checkout session completed for booking ${booking.bookingId}`);
  } catch (error) {
    logger.error('Error handling checkout session completed:', error);
  }
}

/**
 * @desc    Health check for webhook endpoint
 * @route   GET /api/v1/webhooks/health
 * @access  Public
 */
exports.webhookHealth = asyncHandler(async (req, res) => {
  res.json({ status: 'ok', message: 'Webhook endpoint is healthy' });
});

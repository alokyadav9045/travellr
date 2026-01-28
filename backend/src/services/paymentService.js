const stripe = require('../config/stripe');
const Payment = require('../models/Payment');
const PayoutLedger = require('../models/PayoutLedger');
const { env } = require('../config/env');

class PaymentService {
  /**
   * Create a payment intent for booking
   */
  async createPaymentIntent({ bookingId, amount, currency = 'USD', customerId, metadata = {} }) {
    try {
      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(amount * 100), // Convert to cents
        currency: currency.toLowerCase(),
        customer: customerId,
        metadata: {
          bookingId,
          ...metadata
        },
        automatic_payment_methods: {
          enabled: true
        }
      });

      return {
        clientSecret: paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id
      };
    } catch (error) {
      console.error('Error creating payment intent:', error);
      throw new Error('Failed to create payment intent');
    }
  }

  /**
   * Confirm payment and create payment record
   */
  async confirmPayment({ bookingId, paymentIntentId, booking }) {
    try {
      const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

      if (paymentIntent.status !== 'succeeded') {
        throw new Error('Payment not succeeded');
      }

      // Calculate fees
      const stripeFee = paymentIntent.charges.data[0].balance_transaction
        ? (await stripe.balanceTransactions.retrieve(paymentIntent.charges.data[0].balance_transaction)).fee / 100
        : 0;
      
      const platformFeeRate = env.PLATFORM_SERVICE_FEE || 2.5;
      const platformFee = (booking.pricing.totalAmount * platformFeeRate) / 100;
      const totalFees = stripeFee + platformFee;
      const netAmount = booking.pricing.totalAmount - totalFees;

      // Create payment record
      const payment = await Payment.create({
        booking: bookingId,
        customer: booking.customer,
        vendor: booking.vendor,
        amount: booking.pricing.totalAmount,
        currency: booking.pricing.currency,
        type: 'full_payment',
        stripePaymentIntentId: paymentIntentId,
        stripeChargeId: paymentIntent.charges.data[0].id,
        status: 'succeeded',
        paymentMethod: 'card',
        paymentMethodDetails: {
          brand: paymentIntent.charges.data[0].payment_method_details.card.brand,
          last4: paymentIntent.charges.data[0].payment_method_details.card.last4
        },
        fees: {
          stripeFee,
          platformFee,
          totalFees
        },
        netAmount,
        processedAt: new Date()
      });

      // Create ledger entry
      await PayoutLedger.create({
        vendor: booking.vendor,
        booking: bookingId,
        type: 'booking_payment',
        grossAmount: booking.pricing.totalAmount,
        commissionAmount: booking.commission.amount,
        commissionRate: booking.commission.rate,
        serviceFeeAmount: platformFee,
        netAmount: booking.commission.vendorPayout,
        currency: booking.pricing.currency,
        escrowStatus: 'held',
        escrowReleaseDate: booking.departure.endDate, // Release after trip ends
        tripStartDate: booking.departure.startDate,
        tripEndDate: booking.departure.endDate
      });

      return payment;
    } catch (error) {
      console.error('Error confirming payment:', error);
      throw error;
    }
  }

  /**
   * Process refund
   */
  async processRefund({ paymentId, amount, reason }) {
    try {
      const payment = await Payment.findById(paymentId);
      
      if (!payment) {
        throw new Error('Payment not found');
      }

      if (payment.status !== 'succeeded') {
        throw new Error('Cannot refund non-successful payment');
      }

      const refundAmount = amount || payment.amount;

      // Create Stripe refund
      const refund = await stripe.refunds.create({
        charge: payment.stripeChargeId,
        amount: Math.round(refundAmount * 100),
        reason: reason || 'requested_by_customer'
      });

      // Update payment record
      payment.status = refundAmount === payment.amount ? 'refunded' : 'partial_refund';
      payment.refund = {
        amount: refundAmount,
        reason,
        requestedAt: new Date(),
        processedAt: new Date(),
        status: 'succeeded'
      };
      payment.stripeRefundId = refund.id;
      await payment.save();

      // Update ledger entry
      await PayoutLedger.findOneAndUpdate(
        { booking: payment.booking },
        { escrowStatus: 'refunded' }
      );

      return payment;
    } catch (error) {
      console.error('Error processing refund:', error);
      throw error;
    }
  }

  /**
   * Create Stripe Connect account for vendor
   */
  async createConnectAccount({ vendorId, email, businessType }) {
    try {
      const account = await stripe.accounts.create({
        type: 'express',
        country: 'US',
        email,
        capabilities: {
          card_payments: { requested: true },
          transfers: { requested: true }
        },
        business_type: businessType === 'individual' ? 'individual' : 'company'
      });

      return account.id;
    } catch (error) {
      console.error('Error creating Stripe Connect account:', error);
      throw error;
    }
  }

  /**
   * Create Stripe Connect onboarding link
   */
  async createConnectOnboardingLink({ accountId, vendorId }) {
    try {
      const accountLink = await stripe.accountLinks.create({
        account: accountId,
        refresh_url: `${env.CLIENT_URL}/vendor/stripe/refresh`,
        return_url: `${env.CLIENT_URL}/vendor/stripe/return`,
        type: 'account_onboarding'
      });

      return accountLink.url;
    } catch (error) {
      console.error('Error creating onboarding link:', error);
      throw error;
    }
  }

  /**
   * Check Stripe Connect account status
   */
  async getConnectAccountStatus(accountId) {
    try {
      const account = await stripe.accounts.retrieve(accountId);

      return {
        detailsSubmitted: account.details_submitted,
        chargesEnabled: account.charges_enabled,
        payoutsEnabled: account.payouts_enabled,
        requirements: account.requirements
      };
    } catch (error) {
      console.error('Error retrieving account status:', error);
      throw error;
    }
  }

  /**
   * Create payout to vendor
   */
  async createPayout({ vendorId, accountId, amount, currency = 'USD' }) {
    try {
      const transfer = await stripe.transfers.create({
        amount: Math.round(amount * 100),
        currency: currency.toLowerCase(),
        destination: accountId,
        description: `Payout for vendor ${vendorId}`
      });

      return transfer;
    } catch (error) {
      console.error('Error creating payout:', error);
      throw error;
    }
  }
}

module.exports = new PaymentService();

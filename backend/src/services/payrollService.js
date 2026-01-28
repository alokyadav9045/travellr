const Booking = require('../models/Booking');
const Payout = require('../models/Payout');
const PayoutLedger = require('../models/PayoutLedger');
const Vendor = require('../models/Vendor');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const logger = require('../utils/logger');

/**
 * Calculate commission based on vendor tier
 */
const calculateCommission = (amount, vendorTier = 'starter') => {
  const commissionRates = {
    starter: 0.15,      // 15%
    professional: 0.10, // 10%
    enterprise: 0.07    // 7%
  };

  const rate = commissionRates[vendorTier] || 0.10;
  return amount * rate;
};

/**
 * Create payout for a booking
 */
exports.createPayout = async (booking, vendor) => {
  try {
    // Calculate amounts
    const totalAmount = booking.totalPrice;
    const commission = calculateCommission(totalAmount, vendor.subscriptionTier);
    const payoutAmount = totalAmount - commission;

    // Create payout record
    const payout = await Payout.create({
      booking: booking._id,
      vendor: vendor._id,
      amount: payoutAmount,
      commission,
      status: 'pending',
      scheduledFor: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days escrow
    });

    // Create ledger entry for commission
    await PayoutLedger.create({
      vendor: vendor._id,
      booking: booking._id,
      payout: payout._id,
      type: 'debit',
      amount: commission,
      description: `Platform commission (${(commission / totalAmount * 100).toFixed(1)}%)`,
      balance: 0 // Will be calculated
    });

    // Create ledger entry for payout
    await PayoutLedger.create({
      vendor: vendor._id,
      booking: booking._id,
      payout: payout._id,
      type: 'credit',
      amount: payoutAmount,
      description: `Booking payout for ${booking.bookingId}`,
      balance: 0 // Will be calculated
    });

    logger.info(`Payout created for booking ${booking.bookingId}: $${payoutAmount}`);

    return payout;
  } catch (error) {
    logger.error('Error creating payout:', error);
    throw error;
  }
};

/**
 * Process pending payouts (called by cron)
 */
exports.processPendingPayouts = async () => {
  try {
    const now = new Date();

    // Find payouts ready to be processed
    const pendingPayouts = await Payout.find({
      status: 'pending',
      scheduledFor: { $lte: now }
    })
      .populate('vendor', 'stripeAccountId businessName subscriptionTier')
      .populate('booking', 'bookingId totalPrice status');

    logger.info(`Processing ${pendingPayouts.length} pending payouts`);

    for (const payout of pendingPayouts) {
      try {
        // Check if booking is still valid
        if (payout.booking.status === 'cancelled') {
          payout.status = 'cancelled';
          await payout.save();
          continue;
        }

        // Check if vendor has Stripe account
        if (!payout.vendor.stripeAccountId) {
          logger.warn(`Vendor ${payout.vendor._id} has no Stripe account`);
          continue;
        }

        // Create Stripe transfer
        const transfer = await stripe.transfers.create({
          amount: Math.round(payout.amount * 100), // Convert to cents
          currency: 'usd',
          destination: payout.vendor.stripeAccountId,
          transfer_group: payout.booking._id.toString(),
          metadata: {
            payoutId: payout._id.toString(),
            bookingId: payout.booking._id.toString(),
            vendorId: payout.vendor._id.toString()
          }
        });

        // Update payout status
        payout.status = 'completed';
        payout.processedAt = new Date();
        payout.stripeTransferId = transfer.id;
        await payout.save();

        logger.info(`Payout processed successfully: ${payout._id}`);

      } catch (error) {
        logger.error(`Error processing payout ${payout._id}:`, error);

        payout.status = 'failed';
        payout.failureReason = error.message;
        await payout.save();
      }
    }

    return pendingPayouts.length;
  } catch (error) {
    logger.error('Error in processPendingPayouts:', error);
    throw error;
  }
};

/**
 * Get vendor earnings summary
 */
exports.getVendorEarnings = async (vendorId, startDate, endDate) => {
  try {
    const matchStage = {
      vendor: vendorId,
      status: 'completed'
    };

    if (startDate || endDate) {
      matchStage.processedAt = {};
      if (startDate) matchStage.processedAt.$gte = new Date(startDate);
      if (endDate) matchStage.processedAt.$lte = new Date(endDate);
    }

    const earnings = await Payout.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: null,
          totalEarnings: { $sum: '$amount' },
          totalCommission: { $sum: '$commission' },
          totalPayouts: { $sum: 1 }
        }
      }
    ]);

    return earnings[0] || {
      totalEarnings: 0,
      totalCommission: 0,
      totalPayouts: 0
    };
  } catch (error) {
    logger.error('Error getting vendor earnings:', error);
    throw error;
  }
};

/**
 * Request early payout (with fee)
 */
exports.requestEarlyPayout = async (payoutId, vendorId) => {
  try {
    const payout = await Payout.findOne({
      _id: payoutId,
      vendor: vendorId,
      status: 'pending'
    }).populate('vendor', 'stripeAccountId');

    if (!payout) {
      throw new Error('Payout not found or not eligible for early release');
    }

    // Calculate early payout fee (e.g., 2%)
    const earlyFee = payout.amount * 0.02;
    const earlyAmount = payout.amount - earlyFee;

    // Process immediate payout
    const transfer = await stripe.transfers.create({
      amount: Math.round(earlyAmount * 100),
      currency: 'usd',
      destination: payout.vendor.stripeAccountId,
      transfer_group: payout.booking.toString(),
      metadata: {
        payoutId: payout._id.toString(),
        earlyPayout: true,
        earlyFee: earlyFee.toString()
      }
    });

    payout.status = 'completed';
    payout.processedAt = new Date();
    payout.stripeTransferId = transfer.id;
    payout.amount = earlyAmount; // Reduced by fee
    await payout.save();

    // Create ledger entry for early fee
    await PayoutLedger.create({
      vendor: vendorId,
      payout: payout._id,
      type: 'debit',
      amount: earlyFee,
      description: 'Early payout fee (2%)',
      balance: 0
    });

    return payout;
  } catch (error) {
    logger.error('Error requesting early payout:', error);
    throw error;
  }
};

/**
 * Calculate vendor balance
 */
exports.calculateVendorBalance = async (vendorId) => {
  try {
    const ledger = await PayoutLedger.find({ vendor: vendorId })
      .sort({ createdAt: 1 });

    let balance = 0;

    for (const entry of ledger) {
      if (entry.type === 'credit') {
        balance += entry.amount;
      } else if (entry.type === 'debit') {
        balance -= entry.amount;
      }

      entry.balance = balance;
      await entry.save();
    }

    return balance;
  } catch (error) {
    logger.error('Error calculating vendor balance:', error);
    throw error;
  }
};

/**
 * Generate payout report
 */
exports.generatePayoutReport = async (vendorId, startDate, endDate) => {
  try {
    const matchStage = { vendor: vendorId };

    if (startDate || endDate) {
      matchStage.createdAt = {};
      if (startDate) matchStage.createdAt.$gte = new Date(startDate);
      if (endDate) matchStage.createdAt.$lte = new Date(endDate);
    }

    const report = await Payout.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
          totalAmount: { $sum: '$amount' },
          totalCommission: { $sum: '$commission' }
        }
      }
    ]);

    const summary = {
      pending: { count: 0, amount: 0, commission: 0 },
      processing: { count: 0, amount: 0, commission: 0 },
      completed: { count: 0, amount: 0, commission: 0 },
      failed: { count: 0, amount: 0, commission: 0 }
    };

    report.forEach(item => {
      summary[item._id] = {
        count: item.count,
        amount: item.totalAmount,
        commission: item.totalCommission
      };
    });

    return summary;
  } catch (error) {
    logger.error('Error generating payout report:', error);
    throw error;
  }
};

/**
 * Retry failed payout
 */
exports.retryFailedPayout = async (payoutId) => {
  try {
    const payout = await Payout.findOne({
      _id: payoutId,
      status: 'failed'
    }).populate('vendor', 'stripeAccountId');

    if (!payout) {
      throw new Error('Payout not found or not in failed state');
    }

    // Retry Stripe transfer
    const transfer = await stripe.transfers.create({
      amount: Math.round(payout.amount * 100),
      currency: 'usd',
      destination: payout.vendor.stripeAccountId,
      transfer_group: payout.booking.toString()
    });

    payout.status = 'completed';
    payout.processedAt = new Date();
    payout.stripeTransferId = transfer.id;
    payout.failureReason = null;
    await payout.save();

    logger.info(`Payout retry successful: ${payout._id}`);

    return payout;
  } catch (error) {
    logger.error('Error retrying payout:', error);
    throw error;
  }
};

module.exports = exports;

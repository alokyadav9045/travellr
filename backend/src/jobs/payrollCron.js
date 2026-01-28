const cron = require('node-cron');
const Payout = require('../models/Payout');
const PayoutLedger = require('../models/PayoutLedger');
const Vendor = require('../models/Vendor');
const paymentService = require('../services/paymentService');
const emailService = require('../services/emailService');
const notificationService = require('../services/notificationService');

/**
 * Daily Payout Cron Job
 * Runs every day at midnight (00:00)
 * Processes payouts for vendors with weekly schedule
 */
const payrollCron = cron.schedule('0 0 * * *', async () => {
  console.log('Running daily payroll cron job...');
  
  try {
    // Get current day of week (0 = Sunday, 1 = Monday, etc.)
    const today = new Date();
    const dayOfWeek = today.getDay();
    
    // Process weekly payouts on Monday (day 1)
    if (dayOfWeek === 1) {
      await processWeeklyPayouts();
    }
    
    // Process daily payouts every day
    await processDailyPayouts();
    
    // Release escrow for completed trips
    await releaseEscrowFunds();
    
    console.log('Payroll cron job completed successfully');
  } catch (error) {
    console.error('Error in payroll cron job:', error);
  }
}, {
  scheduled: false
});

/**
 * Process weekly payouts
 */
async function processWeeklyPayouts() {
  try {
    // Find vendors with weekly payout schedule
    const vendors = await Vendor.find({
      'settings.payoutSchedule': 'weekly',
      verificationStatus: 'approved',
      stripePayoutsEnabled: true
    });

    for (const vendor of vendors) {
      await processVendorPayout(vendor, 'weekly');
    }
  } catch (error) {
    console.error('Error processing weekly payouts:', error);
  }
}

/**
 * Process daily payouts
 */
async function processDailyPayouts() {
  try {
    // Find vendors with daily payout schedule
    const vendors = await Vendor.find({
      'settings.payoutSchedule': 'daily',
      verificationStatus: 'approved',
      stripePayoutsEnabled: true
    });

    for (const vendor of vendors) {
      await processVendorPayout(vendor, 'daily');
    }
  } catch (error) {
    console.error('Error processing daily payouts:', error);
  }
}

/**
 * Process payout for a single vendor
 */
async function processVendorPayout(vendor, schedule) {
  try {
    // Get available balance
    const { availableBalance, transactionCount } = await PayoutLedger.getVendorBalance(vendor._id);

    // Minimum payout threshold: $50
    if (availableBalance < 50) {
      console.log(`Vendor ${vendor.businessName} balance below threshold: $${availableBalance}`);
      return;
    }

    // Get ledger entries for this payout
    const ledgerEntries = await PayoutLedger.find({
      vendor: vendor._id,
      escrowStatus: 'released',
      payoutStatus: 'pending'
    }).populate('booking');

    if (ledgerEntries.length === 0) {
      return;
    }

    // Calculate period
    const periodStart = ledgerEntries[ledgerEntries.length - 1].createdAt;
    const periodEnd = new Date();

    // Create payout record
    const payout = await Payout.create({
      vendor: vendor._id,
      amount: availableBalance,
      currency: 'INR',
      bookings: ledgerEntries.map(entry => ({
        booking: entry.booking._id,
        amount: entry.grossAmount,
        commission: entry.commissionAmount,
        netAmount: entry.netAmount
      })),
      status: 'processing',
      scheduledDate: new Date(),
      periodStart,
      periodEnd
    });

    // Create Stripe transfer if vendor has Stripe account
    if (vendor.stripeAccountId) {
      try {
        const transfer = await paymentService.createPayout({
          vendorId: vendor._id,
          accountId: vendor.stripeAccountId,
          amount: availableBalance,
          currency: 'USD'
        });

        payout.stripeTransferId = transfer.id;
        payout.status = 'in_transit';
        payout.processedAt = new Date();
        await payout.save();

        // Update ledger entries
        await PayoutLedger.updateMany(
          { _id: { $in: ledgerEntries.map(e => e._id) } },
          {
            payout: payout._id,
            payoutStatus: 'included_in_payout',
            paidAt: new Date()
          }
        );

        // Send notification
        await notificationService.notifyPayoutProcessed(vendor, payout);
        await emailService.sendVendorPayoutNotification(vendor, payout);

        console.log(`Payout processed for vendor ${vendor.businessName}: $${availableBalance}`);
      } catch (error) {
        payout.status = 'failed';
        payout.failureMessage = error.message;
        await payout.save();
        console.error(`Failed to process payout for vendor ${vendor.businessName}:`, error);
      }
    }
  } catch (error) {
    console.error(`Error processing payout for vendor ${vendor.businessName}:`, error);
  }
}

/**
 * Release escrow funds for completed trips
 */
async function releaseEscrowFunds() {
  try {
    const now = new Date();

    // Find ledger entries where trip has ended and escrow should be released
    const entriesToRelease = await PayoutLedger.find({
      escrowStatus: 'held',
      escrowReleaseDate: { $lte: now }
    });

    for (const entry of entriesToRelease) {
      entry.escrowStatus = 'released';
      entry.escrowReleasedAt = now;
      await entry.save();
    }

    console.log(`Released escrow for ${entriesToRelease.length} transactions`);
  } catch (error) {
    console.error('Error releasing escrow funds:', error);
  }
}

module.exports = { payrollCron, processVendorPayout, releaseEscrowFunds };

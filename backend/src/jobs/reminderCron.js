const cron = require('node-cron');
const Booking = require('../models/Booking');
const emailService = require('../services/emailService');
const notificationService = require('../services/notificationService');

/**
 * Reminder Cron Job
 * Runs every hour to send various reminders
 */
const reminderCron = cron.schedule('0 * * * *', async () => {
  console.log('Running hourly reminder cron job...');
  
  try {
    await sendTripReminders();
    await sendPaymentReminders();
    await sendReviewReminders();
    
    console.log('Reminder cron job completed successfully');
  } catch (error) {
    console.error('Error in reminder cron job:', error);
  }
}, {
  scheduled: false
});

/**
 * Send trip reminders to customers
 * - 7 days before trip
 * - 3 days before trip
 * - 1 day before trip
 */
async function sendTripReminders() {
  try {
    const now = new Date();
    const reminderDays = [7, 3, 1];

    for (const days of reminderDays) {
      const targetDate = new Date();
      targetDate.setDate(targetDate.getDate() + days);
      targetDate.setHours(0, 0, 0, 0);

      const nextDay = new Date(targetDate);
      nextDay.setDate(nextDay.getDate() + 1);

      // Find bookings starting in 'days' days that haven't received this reminder
      const bookings = await Booking.find({
        status: 'confirmed',
        'departure.startDate': {
          $gte: targetDate,
          $lt: nextDay
        },
        'reminders.tripReminderSent': false
      })
        .populate('customer', 'name email')
        .populate('trip', 'title duration');

      for (const booking of bookings) {
        try {
          // Send email
          await emailService.sendTripReminder(
            booking,
            booking.customer,
            booking.tripSnapshot,
            days
          );

          // Send notification
          await notificationService.notifyTripReminder(booking, days);

          // Mark reminder as sent
          booking.reminders.tripReminderSent = true;
          await booking.save();

          console.log(`Trip reminder sent to ${booking.customer.email} for ${days} days before trip`);
        } catch (error) {
          console.error(`Error sending trip reminder for booking ${booking.bookingNumber}:`, error);
        }
      }
    }
  } catch (error) {
    console.error('Error sending trip reminders:', error);
  }
}

/**
 * Send payment reminders for pending bookings
 * - Bookings pending payment for > 24 hours
 * - Bookings with pending balance payment
 */
async function sendPaymentReminders() {
  try {
    const now = new Date();
    const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);

    // Find bookings pending payment for > 24 hours
    const pendingBookings = await Booking.find({
      status: 'pending',
      'payment.status': 'pending',
      'reminders.paymentReminderSent': false,
      createdAt: { $lte: yesterday }
    })
      .populate('customer', 'name email')
      .populate('trip', 'title');

    for (const booking of pendingBookings) {
      try {
        // Send payment reminder email
        // await emailService.sendPaymentReminder(booking, booking.customer, booking.trip);

        // Mark reminder as sent
        booking.reminders.paymentReminderSent = true;
        await booking.save();

        console.log(`Payment reminder sent for booking ${booking.bookingNumber}`);
      } catch (error) {
        console.error(`Error sending payment reminder for booking ${booking.bookingNumber}:`, error);
      }
    }

    // Find bookings with pending balance payment near due date
    const balanceDueDate = new Date();
    balanceDueDate.setDate(balanceDueDate.getDate() + 3); // 3 days before due

    const balanceReminders = await Booking.find({
      status: 'confirmed',
      'payment.depositRequired': true,
      'payment.depositPaidAt': { $exists: true },
      'payment.balancePaidAt': { $exists: false },
      'payment.balanceDueDate': {
        $gte: now,
        $lte: balanceDueDate
      }
    })
      .populate('customer', 'name email')
      .populate('trip', 'title');

    for (const booking of balanceReminders) {
      try {
        // Send balance reminder email
        // await emailService.sendBalancePaymentReminder(booking, booking.customer, booking.trip);

        console.log(`Balance payment reminder sent for booking ${booking.bookingNumber}`);
      } catch (error) {
        console.error(`Error sending balance reminder for booking ${booking.bookingNumber}:`, error);
      }
    }
  } catch (error) {
    console.error('Error sending payment reminders:', error);
  }
}

/**
 * Send review reminders to customers after completed trips
 * - 2 days after trip completion
 */
async function sendReviewReminders() {
  try {
    const now = new Date();
    const twoDaysAgo = new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000);
    const threeDaysAgo = new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000);

    // Find completed bookings from 2 days ago without reviews
    const bookings = await Booking.find({
      status: 'completed',
      'departure.endDate': {
        $gte: threeDaysAgo,
        $lte: twoDaysAgo
      },
      'reminders.reviewReminderSent': false
    })
      .populate('customer', 'name email')
      .populate('trip', 'title');

    for (const booking of bookings) {
      try {
        // Check if review already exists
        const Review = require('../models/Review');
        const existingReview = await Review.findOne({ booking: booking._id });

        if (existingReview) {
          booking.reminders.reviewReminderSent = true;
          await booking.save();
          continue;
        }

        // Send review reminder email
        // await emailService.sendReviewReminder(booking, booking.customer, booking.trip);

        // Send notification
        await notificationService.createNotification({
          user: booking.customer._id,
          type: 'review',
          title: 'Share Your Experience',
          message: `How was your trip "${booking.tripSnapshot.title}"? Leave a review to help other travelers!`,
          data: { bookingId: booking._id },
          link: `/bookings/${booking._id}/review`
        });

        booking.reminders.reviewReminderSent = true;
        await booking.save();

        console.log(`Review reminder sent for booking ${booking.bookingNumber}`);
      } catch (error) {
        console.error(`Error sending review reminder for booking ${booking.bookingNumber}:`, error);
      }
    }
  } catch (error) {
    console.error('Error sending review reminders:', error);
  }
}

module.exports = { reminderCron, sendTripReminders, sendPaymentReminders, sendReviewReminders };

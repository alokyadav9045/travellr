const Notification = require('../models/Notification');
const socketService = require('./socketService');

class NotificationService {
  /**
   * Create and send notification
   */
  async createNotification({ user, type, title, message, data = {}, link = null }) {
    try {
      const notification = await Notification.create({
        user,
        type,
        title,
        message,
        data,
        link
      });

      // Emit socket event for real-time notification
      socketService.emitToUser(user.toString(), 'notification', notification);

      return notification;
    } catch (error) {
      console.error('Error creating notification:', error);
      throw error;
    }
  }

  /**
   * Notify user about new booking
   */
  async notifyBookingCreated(booking) {
    try {
      // Notify vendor
      await this.createNotification({
        user: booking.vendor.user,
        type: 'booking',
        title: 'New Booking Received',
        message: `You have a new booking for ${booking.tripSnapshot.title}`,
        data: { bookingId: booking._id },
        link: `/vendor/bookings/${booking._id}`
      });

      // Notify customer
      await this.createNotification({
        user: booking.customer,
        type: 'booking',
        title: 'Booking Confirmed',
        message: `Your booking for ${booking.tripSnapshot.title} has been confirmed`,
        data: { bookingId: booking._id },
        link: `/bookings/${booking._id}`
      });
    } catch (error) {
      console.error('Error notifying booking created:', error);
    }
  }

  /**
   * Notify user about booking cancellation
   */
  async notifyBookingCancelled(booking, cancelledBy) {
    try {
      if (cancelledBy === 'vendor') {
        // Notify customer
        await this.createNotification({
          user: booking.customer,
          type: 'booking',
          title: 'Booking Cancelled',
          message: `Your booking for ${booking.tripSnapshot.title} has been cancelled by the vendor`,
          data: { bookingId: booking._id },
          link: `/bookings/${booking._id}`
        });
      } else {
        // Notify vendor
        await this.createNotification({
          user: booking.vendor.user,
          type: 'booking',
          title: 'Booking Cancelled',
          message: `Customer cancelled booking for ${booking.tripSnapshot.title}`,
          data: { bookingId: booking._id },
          link: `/vendor/bookings/${booking._id}`
        });
      }
    } catch (error) {
      console.error('Error notifying booking cancelled:', error);
    }
  }

  /**
   * Notify vendor about new review
   */
  async notifyNewReview(review, trip) {
    try {
      await this.createNotification({
        user: review.vendor.user,
        type: 'review',
        title: 'New Review Received',
        message: `You received a ${review.ratings.overall}-star review for ${trip.title}`,
        data: { reviewId: review._id, tripId: trip._id },
        link: `/vendor/reviews`
      });
    } catch (error) {
      console.error('Error notifying new review:', error);
    }
  }

  /**
   * Notify user about payout
   */
  async notifyPayoutProcessed(vendor, payout) {
    try {
      await this.createNotification({
        user: vendor.user,
        type: 'payout',
        title: 'Payout Processed',
        message: `Your payout of $${payout.amount.toFixed(2)} has been processed`,
        data: { payoutId: payout._id },
        link: `/vendor/payouts`
      });
    } catch (error) {
      console.error('Error notifying payout processed:', error);
    }
  }

  /**
   * Notify about vendor approval
   */
  async notifyVendorApproved(vendor) {
    try {
      await this.createNotification({
        user: vendor.user,
        type: 'account',
        title: 'Vendor Account Approved',
        message: 'Congratulations! Your vendor account has been approved. You can now start creating trips.',
        link: `/vendor/dashboard`
      });
    } catch (error) {
      console.error('Error notifying vendor approved:', error);
    }
  }

  /**
   * Notify about trip reminder
   */
  async notifyTripReminder(booking, daysUntil) {
    try {
      await this.createNotification({
        user: booking.customer,
        type: 'reminder',
        title: `Trip Starting Soon`,
        message: `Your trip "${booking.tripSnapshot.title}" starts in ${daysUntil} days`,
        data: { bookingId: booking._id },
        link: `/bookings/${booking._id}`
      });
    } catch (error) {
      console.error('Error notifying trip reminder:', error);
    }
  }

  /**
   * Get user notifications
   */
  async getUserNotifications(userId, { page = 1, limit = 20, unreadOnly = false } = {}) {
    try {
      const query = { user: userId };
      if (unreadOnly) {
        query.isRead = false;
      }

      const skip = (page - 1) * limit;

      const [notifications, total] = await Promise.all([
        Notification.find(query)
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(limit),
        Notification.countDocuments(query)
      ]);

      return {
        notifications,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      };
    } catch (error) {
      console.error('Error getting user notifications:', error);
      throw error;
    }
  }

  /**
   * Mark notification as read
   */
  async markAsRead(notificationId, userId) {
    try {
      const notification = await Notification.findOneAndUpdate(
        { _id: notificationId, user: userId },
        { isRead: true, readAt: new Date() },
        { new: true }
      );

      return notification;
    } catch (error) {
      console.error('Error marking notification as read:', error);
      throw error;
    }
  }

  /**
   * Mark all notifications as read
   */
  async markAllAsRead(userId) {
    try {
      await Notification.updateMany(
        { user: userId, isRead: false },
        { isRead: true, readAt: new Date() }
      );
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      throw error;
    }
  }

  /**
   * Get unread count
   */
  async getUnreadCount(userId) {
    try {
      return await Notification.countDocuments({ user: userId, isRead: false });
    } catch (error) {
      console.error('Error getting unread count:', error);
      throw error;
    }
  }
}

module.exports = new NotificationService();

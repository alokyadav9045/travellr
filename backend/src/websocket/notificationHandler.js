const Notification = require('../models/Notification');
const logger = require('../utils/logger');

module.exports = (socket, io) => {
  /**
   * Get unread notifications count
   */
  socket.on('notification:getUnreadCount', async () => {
    try {
      const count = await Notification.countDocuments({
        user: socket.userId,
        read: false
      });

      socket.emit('notification:unreadCount', { count });
    } catch (error) {
      logger.error('Error getting unread count:', error);
    }
  });

  /**
   * Get notifications
   */
  socket.on('notification:getAll', async (data) => {
    try {
      const { page = 1, limit = 20, unreadOnly = false } = data;

      const query = { user: socket.userId };
      if (unreadOnly) query.read = false;

      const notifications = await Notification.find(query)
        .sort({ createdAt: -1 })
        .limit(limit)
        .skip((page - 1) * limit);

      const total = await Notification.countDocuments(query);

      socket.emit('notification:list', {
        notifications,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit)
        }
      });
    } catch (error) {
      logger.error('Error getting notifications:', error);
      socket.emit('notification:error', { message: 'Failed to load notifications' });
    }
  });

  /**
   * Mark notification as read
   */
  socket.on('notification:markAsRead', async (data) => {
    try {
      const { notificationId } = data;

      const notification = await Notification.findOneAndUpdate(
        {
          _id: notificationId,
          user: socket.userId
        },
        {
          read: true,
          readAt: new Date()
        },
        { new: true }
      );

      if (notification) {
        socket.emit('notification:updated', { notification });

        // Send updated unread count
        const count = await Notification.countDocuments({
          user: socket.userId,
          read: false
        });
        socket.emit('notification:unreadCount', { count });
      }
    } catch (error) {
      logger.error('Error marking notification as read:', error);
    }
  });

  /**
   * Mark all notifications as read
   */
  socket.on('notification:markAllAsRead', async () => {
    try {
      await Notification.updateMany(
        {
          user: socket.userId,
          read: false
        },
        {
          read: true,
          readAt: new Date()
        }
      );

      socket.emit('notification:allMarkedAsRead');
      socket.emit('notification:unreadCount', { count: 0 });

      logger.info(`All notifications marked as read for user ${socket.userId}`);
    } catch (error) {
      logger.error('Error marking all as read:', error);
      socket.emit('notification:error', { message: 'Failed to mark all as read' });
    }
  });

  /**
   * Delete notification
   */
  socket.on('notification:delete', async (data) => {
    try {
      const { notificationId } = data;

      await Notification.findOneAndDelete({
        _id: notificationId,
        user: socket.userId
      });

      socket.emit('notification:deleted', { notificationId });

      // Send updated unread count
      const count = await Notification.countDocuments({
        user: socket.userId,
        read: false
      });
      socket.emit('notification:unreadCount', { count });

      logger.info(`Notification ${notificationId} deleted`);
    } catch (error) {
      logger.error('Error deleting notification:', error);
      socket.emit('notification:error', { message: 'Failed to delete notification' });
    }
  });

  /**
   * Clear all notifications
   */
  socket.on('notification:clearAll', async () => {
    try {
      await Notification.deleteMany({ user: socket.userId });

      socket.emit('notification:allCleared');
      socket.emit('notification:unreadCount', { count: 0 });

      logger.info(`All notifications cleared for user ${socket.userId}`);
    } catch (error) {
      logger.error('Error clearing notifications:', error);
      socket.emit('notification:error', { message: 'Failed to clear notifications' });
    }
  });

  /**
   * Subscribe to notification types
   */
  socket.on('notification:subscribe', (data) => {
    const { types } = data;

    if (Array.isArray(types)) {
      types.forEach(type => {
        socket.join(`notification:${type}`);
      });

      logger.info(`User ${socket.userId} subscribed to notification types: ${types.join(', ')}`);
    }
  });

  /**
   * Unsubscribe from notification types
   */
  socket.on('notification:unsubscribe', (data) => {
    const { types } = data;

    if (Array.isArray(types)) {
      types.forEach(type => {
        socket.leave(`notification:${type}`);
      });

      logger.info(`User ${socket.userId} unsubscribed from notification types: ${types.join(', ')}`);
    }
  });
};

/**
 * Helper function to send notification via socket
 * Can be called from other services
 */
const sendNotification = (io, userId, notification) => {
  io.to(`user:${userId}`).emit('notification:new', notification);
  logger.info(`Notification sent to user ${userId}`);
};

module.exports.sendNotification = sendNotification;

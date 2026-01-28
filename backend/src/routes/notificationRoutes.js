const express = require('express');
const router = express.Router();
const Notification = require('../models/Notification');
const auth = require('../middleware/auth');
const asyncHandler = require('../middleware/asyncHandler');
const ApiResponse = require('../utils/ApiResponse');

// @route   GET /api/notifications
// @desc    Get user notifications
// @access  Private
router.get('/', auth(), asyncHandler(async (req, res) => {
  const { page = 1, limit = 20, read } = req.query;

  const query = { to: req.user.id };
  if (read !== undefined) {
    query.read = read === 'true';
  }

  const notifications = await Notification.find(query)
    .sort({ createdAt: -1 })
    .limit(limit * 1)
    .skip((page - 1) * limit)
    .lean();

  const count = await Notification.countDocuments(query);
  const unreadCount = await Notification.countDocuments({ to: req.user.id, read: false });

  res.json(
    new ApiResponse(true, 'Notifications fetched successfully', {
      notifications,
      unreadCount,
      totalPages: Math.ceil(count / limit),
      currentPage: parseInt(page),
    })
  );
}));

// @route   GET /api/notifications/unread-count
// @desc    Get unread notifications count
// @access  Private
router.get('/unread-count', auth(), asyncHandler(async (req, res) => {
  const count = await Notification.countDocuments({
    to: req.user.id,
    read: false,
  });

  res.json(new ApiResponse(true, 'Unread count fetched', { count }));
}));

// @route   PATCH /api/notifications/:id/read
// @desc    Mark notification as read
// @access  Private
router.patch('/:id/read', auth(), asyncHandler(async (req, res) => {
  const notification = await Notification.findOneAndUpdate(
    { _id: req.params.id, to: req.user.id },
    { read: true },
    { new: true }
  );

  if (!notification) {
    return res.status(404).json(new ApiResponse(false, 'Notification not found'));
  }

  res.json(new ApiResponse(true, 'Notification marked as read', { notification }));
}));

// @route   PATCH /api/notifications/read-all
// @desc    Mark all notifications as read
// @access  Private
router.patch('/read-all', auth(), asyncHandler(async (req, res) => {
  await Notification.updateMany(
    { to: req.user.id, read: false },
    { read: true }
  );

  res.json(new ApiResponse(true, 'All notifications marked as read'));
}));

// @route   DELETE /api/notifications/:id
// @desc    Delete notification
// @access  Private
router.delete('/:id', auth(), asyncHandler(async (req, res) => {
  const notification = await Notification.findOneAndDelete({
    _id: req.params.id,
    to: req.user.id,
  });

  if (!notification) {
    return res.status(404).json(new ApiResponse(false, 'Notification not found'));
  }

  res.json(new ApiResponse(true, 'Notification deleted'));
}));

// @route   DELETE /api/notifications
// @desc    Delete all notifications
// @access  Private
router.delete('/', auth(), asyncHandler(async (req, res) => {
  await Notification.deleteMany({ to: req.user.id });
  res.json(new ApiResponse(true, 'All notifications deleted'));
}));

module.exports = router;

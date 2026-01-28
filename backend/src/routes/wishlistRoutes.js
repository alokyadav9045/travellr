const express = require('express');
const router = express.Router();
const Wishlist = require('../models/Wishlist');
const auth = require('../middleware/auth');
const asyncHandler = require('../middleware/asyncHandler');
const { ApiResponse } = require('../utils/ApiResponse');

// @route   GET /api/wishlist
// @desc    Get user's wishlist
// @access  Private
router.get('/', auth(), asyncHandler(async (req, res) => {
  const { page = 1, limit = 20 } = req.query;

  const result = await Wishlist.getUserWishlist(req.user.id, {
    page: parseInt(page),
    limit: parseInt(limit),
  });

  return new ApiResponse(200, result, 'Wishlist fetched successfully').send(res);
}));

// @route   POST /api/wishlist/:tripId
// @desc    Toggle trip in wishlist
// @access  Private
router.post('/:tripId', auth(), asyncHandler(async (req, res) => {
  const { notes } = req.body;
  
  const result = await Wishlist.toggle(req.user.id, req.params.tripId, notes);

  return new ApiResponse(
    200,
    result,
    result.added ? 'Added to wishlist' : 'Removed from wishlist'
  ).send(res);
}));

// @route   GET /api/wishlist/check/:tripId
// @desc    Check if trip is in wishlist
// @access  Private
router.get('/check/:tripId', auth(), asyncHandler(async (req, res) => {
  const inWishlist = await Wishlist.isInWishlist(req.user.id, req.params.tripId);

  return new ApiResponse(200, { inWishlist }, 'Wishlist status checked').send(res);
}));

// @route   DELETE /api/wishlist/:tripId
// @desc    Remove trip from wishlist
// @access  Private
router.delete('/:tripId', auth(), asyncHandler(async (req, res) => {
  await Wishlist.deleteOne({ user: req.user.id, trip: req.params.tripId });

  return new ApiResponse(200, null, 'Removed from wishlist').send(res);
}));

// @route   DELETE /api/wishlist
// @desc    Clear entire wishlist
// @access  Private
router.delete('/', auth(), asyncHandler(async (req, res) => {
  await Wishlist.deleteMany({ user: req.user.id });

  return new ApiResponse(200, null, 'Wishlist cleared').send(res);
}));

module.exports = router;

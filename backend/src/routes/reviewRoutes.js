const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const asyncHandler = require('../middleware/asyncHandler');
const { ApiResponse } = require('../utils/ApiResponse');
const ApiError = require('../utils/ApiError');

// Review controller functions
const reviewController = {
  // Create review
  create: asyncHandler(async (req, res, next) => {
    const Review = require('../models/Review');
    const Booking = require('../models/Booking');
    const { booking: bookingId, rating, title, comment } = req.body;

    // Verify booking belongs to user and is completed
    const booking = await Booking.findOne({
      _id: bookingId,
      user: req.user.id,
      status: 'completed'
    });

    if (!booking) {
      return next(ApiError.notFound('Booking not found or not eligible for review'));
    }

    // Check if review already exists
    const existingReview = await Review.findOne({ booking: bookingId });
    if (existingReview) {
      return next(ApiError.badRequest('Review already exists for this booking'));
    }

    const review = await Review.create({
      booking: bookingId,
      trip: booking.trip,
      user: req.user.id,
      vendor: booking.vendor,
      rating,
      title,
      comment,
    });

    return new ApiResponse(201, review, 'Review created successfully').send(res);
  }),

  // Get reviews for trip
  getForTrip: asyncHandler(async (req, res) => {
    const Review = require('../models/Review');
    const { tripId } = req.params;
    const { page = 1, limit = 10 } = req.query;

    const reviews = await Review.find({ trip: tripId })
      .populate('user', 'name avatar')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const total = await Review.countDocuments({ trip: tripId });

    return new ApiResponse(200, {
      reviews,
      pagination: {
        total,
        page: Number(page),
        pages: Math.ceil(total / limit),
      },
    }).send(res);
  }),

  // Respond to review (vendor only)
  respond: asyncHandler(async (req, res, next) => {
    const Review = require('../models/Review');
    const { id } = req.params;
    const { response } = req.body;

    const review = await Review.findById(id).populate('vendor');

    if (!review) {
      return next(ApiError.notFound('Review not found'));
    }

    // Check if user is the vendor
    if (review.vendor.user.toString() !== req.user.id.toString()) {
      return next(ApiError.forbidden('Not authorized'));
    }

    review.vendorResponse = {
      comment: response,
      respondedAt: new Date(),
    };

    await review.save();

    return new ApiResponse(200, review, 'Response added successfully').send(res);
  }),
};

// Routes
router.post('/', auth(), reviewController.create);
router.get('/trip/:tripId', reviewController.getForTrip);
router.post('/:id/respond', auth(), reviewController.respond);

module.exports = router;

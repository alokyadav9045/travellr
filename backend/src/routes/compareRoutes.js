const express = require('express');
const router = express.Router();
const Trip = require('../models/Trip');
const auth = require('../middleware/auth');
const asyncHandler = require('../middleware/asyncHandler');
const ApiResponse = require('../utils/ApiResponse');

// @route   GET /api/compare
// @desc    Compare trips
// @access  Public
router.get('/', asyncHandler(async (req, res) => {
  const { ids } = req.query;

  if (!ids) {
    return res.status(400).json(new ApiResponse(false, 'Trip IDs required'));
  }

  const tripIds = ids.split(',').slice(0, 4); // Max 4 trips

  const trips = await Trip.find({ _id: { $in: tripIds }, status: 'active' })
    .populate('vendor', 'businessName rating')
    .lean();

  if (trips.length === 0) {
    return res.status(404).json(new ApiResponse(false, 'No trips found'));
  }

  // Extract comparison data
  const comparison = {
    trips: trips.map(trip => ({
      _id: trip._id,
      title: trip.title,
      category: trip.category,
      price: trip.pricing.basePrice,
      duration: trip.duration,
      location: trip.location,
      rating: trip.averageRating,
      reviewCount: trip.totalReviews,
      maxGroupSize: trip.maxGroupSize,
      difficulty: trip.difficulty,
      images: trip.images,
      vendor: trip.vendor,
      highlights: trip.highlights?.slice(0, 5),
      included: trip.included?.slice(0, 5),
      excluded: trip.excluded?.slice(0, 5),
    })),
    features: [
      { key: 'price', label: 'Price', type: 'currency' },
      { key: 'duration', label: 'Duration', type: 'duration' },
      { key: 'rating', label: 'Rating', type: 'rating' },
      { key: 'maxGroupSize', label: 'Group Size', type: 'number' },
      { key: 'difficulty', label: 'Difficulty', type: 'text' },
      { key: 'location', label: 'Location', type: 'location' },
    ],
  };

  res.json(new ApiResponse(true, 'Comparison data fetched', comparison));
}));

module.exports = router;

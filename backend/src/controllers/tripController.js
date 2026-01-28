const asyncHandler = require('../middleware/asyncHandler');
const { ApiResponse } = require('../utils/ApiResponse');
const ApiError = require('../utils/ApiError');
const Trip = require('../models/Trip');
const Vendor = require('../models/Vendor');
const storageService = require('../services/storageService');

exports.list = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, q, category, minPrice, maxPrice, minDuration, maxDuration, featured, vendor, sortBy = 'createdAt' } = req.query;
  const skip = (page - 1) * limit;
  const filter = { isActive: true };

  if (q) filter.$text = { $search: q };
  if (category) filter.category = category;
  if (vendor) filter.vendor = vendor;
  if (featured === 'true') filter.isFeatured = true;
  if (minPrice || maxPrice) {
    filter.price = {};
    if (minPrice) filter.price.$gte = Number(minPrice);
    if (maxPrice) filter.price.$lte = Number(maxPrice);
  }
  if (minDuration || maxDuration) {
    filter.duration = {};
    if (minDuration) filter.duration.$gte = Number(minDuration);
    if (maxDuration) filter.duration.$lte = Number(maxDuration);
  }

  // Build sort object based on sortBy parameter
  let sortObj = {};
  switch (sortBy) {
    case 'price-asc':
      sortObj = { price: 1 };
      break;
    case 'price-desc':
      sortObj = { price: -1 };
      break;
    case 'rating':
      sortObj = { 'stats.rating': -1 };
      break;
    case 'popular':
      sortObj = { 'stats.bookingsCount': -1 };
      break;
    case 'newest':
      sortObj = { createdAt: -1 };
      break;
    default:
      sortObj = { createdAt: -1 };
  }

  const [items, total] = await Promise.all([
    Trip.find(filter).sort(sortObj).skip(skip).limit(parseInt(limit, 10)).populate('vendor', 'businessName').lean(),
    Trip.countDocuments(filter),
  ]);

  return new ApiResponse(200, items, 'Trips retrieved', {
    pagination: { total, page: parseInt(page, 10), limit: parseInt(limit, 10), pages: Math.ceil(total / limit) }
  }).send(res);
});

exports.get = asyncHandler(async (req, res, next) => {
  const { slug } = req.params;

  // Try finding by slug first, then by ID (for backwards compatibility)
  let trip = await Trip.findOne({ slug }).populate('vendor', 'businessName email phone').lean();

  if (!trip) {
    // Try finding by ID if it looks like a valid ObjectId
    const mongoose = require('mongoose');
    if (mongoose.Types.ObjectId.isValid(slug)) {
      trip = await Trip.findById(slug).populate('vendor', 'businessName email phone').lean();
    }
  }

  if (!trip) return next(ApiError.notFound('Trip not found'));
  return new ApiResponse(200, trip).send(res);
});

exports.create = asyncHandler(async (req, res, next) => {
  const userId = req.user.id;

  // Check if user is vendor
  const vendor = await Vendor.findOne({ user: userId });
  if (!vendor) return next(ApiError.forbidden('Only vendors can create trips'));
  if (!vendor.isVerified) return next(ApiError.forbidden('Vendor account not verified'));

  const tripData = { ...req.body, vendor: vendor._id };
  const trip = await Trip.create(tripData);

  return new ApiResponse(201, trip, 'Trip created successfully').send(res);
});

exports.update = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const userId = req.user.id;

  const trip = await Trip.findById(id).populate('vendor');
  if (!trip) return next(ApiError.notFound('Trip not found'));

  // Check ownership or admin
  if (trip.vendor.user.toString() !== userId && req.user.role !== 'admin') {
    return next(ApiError.forbidden('Not authorized to update this trip'));
  }

  const allowedUpdates = ['title', 'description', 'price', 'duration', 'maxGroupSize', 'difficulty', 'category', 'startDates', 'itinerary', 'inclusions', 'exclusions', 'location', 'isActive'];
  const updates = {};
  allowedUpdates.forEach(field => {
    if (req.body[field] !== undefined) updates[field] = req.body[field];
  });

  Object.assign(trip, updates);
  await trip.save();

  return new ApiResponse(200, trip, 'Trip updated successfully').send(res);
});

exports.delete = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const userId = req.user.id;

  const trip = await Trip.findById(id).populate('vendor');
  if (!trip) return next(ApiError.notFound('Trip not found'));

  // Check ownership or admin
  if (trip.vendor.user.toString() !== userId && req.user.role !== 'admin') {
    return next(ApiError.forbidden('Not authorized to delete this trip'));
  }

  // Soft delete
  trip.isActive = false;
  await trip.save();

  return new ApiResponse(200, null, 'Trip deleted successfully').send(res);
});

exports.uploadImages = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const userId = req.user.id;

  const trip = await Trip.findById(id).populate('vendor');
  if (!trip) return next(ApiError.notFound('Trip not found'));

  // Check ownership
  if (trip.vendor.user.toString() !== userId && req.user.role !== 'admin') {
    return next(ApiError.forbidden('Not authorized to update this trip'));
  }

  if (!req.files || req.files.length === 0) {
    return next(ApiError.badRequest('No files uploaded'));
  }

  const uploadPromises = req.files.map(file =>
    storageService.uploadImage(file.buffer, `trips/${trip._id}`)
  );

  const uploadedImages = await Promise.all(uploadPromises);
  trip.images = [...(trip.images || []), ...uploadedImages];
  await trip.save();

  return new ApiResponse(200, { images: trip.images }, 'Images uploaded successfully').send(res);
});

exports.deleteImage = asyncHandler(async (req, res, next) => {
  const { id, imageId } = req.params;
  const userId = req.user.id;

  const trip = await Trip.findById(id).populate('vendor');
  if (!trip) return next(ApiError.notFound('Trip not found'));

  if (trip.vendor.user.toString() !== userId && req.user.role !== 'admin') {
    return next(ApiError.forbidden('Not authorized'));
  }

  trip.images = trip.images.filter(img => img !== imageId);
  await trip.save();

  return new ApiResponse(200, { images: trip.images }, 'Image deleted successfully').send(res);
});

exports.publishTrip = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const userId = req.user.id;

  const trip = await Trip.findById(id).populate('vendor');
  if (!trip) return next(ApiError.notFound('Trip not found'));

  if (trip.vendor.user.toString() !== userId && req.user.role !== 'admin') {
    return next(ApiError.forbidden('Not authorized'));
  }

  trip.status = 'published';
  trip.isActive = true;
  await trip.save();

  return new ApiResponse(200, trip, 'Trip published successfully').send(res);
});

exports.unpublishTrip = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const userId = req.user.id;

  const trip = await Trip.findById(id).populate('vendor');
  if (!trip) return next(ApiError.notFound('Trip not found'));

  if (trip.vendor.user.toString() !== userId && req.user.role !== 'admin') {
    return next(ApiError.forbidden('Not authorized'));
  }

  trip.status = 'paused';
  trip.isActive = false;
  await trip.save();

  return new ApiResponse(200, trip, 'Trip unpublished successfully').send(res);
});

exports.checkAvailability = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const { departureId, guests } = req.query;

  const trip = await Trip.findById(id);
  if (!trip) return next(ApiError.notFound('Trip not found'));

  // Find departure
  const departure = trip.dates.find(d => d._id.toString() === departureId);
  if (!departure) return next(ApiError.notFound('Departure not found'));

  const available = departure.availableSeats >= parseInt(guests);
  const remainingSpots = departure.availableSeats - parseInt(guests);

  return new ApiResponse(200, { available, remainingSpots }, 'Availability checked').send(res);
});

exports.getSimilarTrips = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const { limit = 4 } = req.query;

  const trip = await Trip.findById(id);
  if (!trip) return next(ApiError.notFound('Trip not found'));

  const similar = await Trip.find({
    category: trip.category,
    location: trip.location,
    _id: { $ne: id },
    isActive: true
  }).limit(parseInt(limit)).lean();

  return new ApiResponse(200, similar, 'Similar trips retrieved').send(res);
});

exports.getTripReviews = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const { page = 1, limit = 10 } = req.query;

  const Review = require('../models/Review');

  const reviews = await Review.find({ trip: id })
    .populate('user', 'name avatar')
    .sort({ createdAt: -1 })
    .limit(limit * 1)
    .skip((page - 1) * limit)
    .lean();

  const total = await Review.countDocuments({ trip: id });

  return new ApiResponse(200, {
    reviews,
    pagination: { total, page: parseInt(page), limit: parseInt(limit), pages: Math.ceil(total / limit) }
  }, 'Reviews retrieved').send(res);
});

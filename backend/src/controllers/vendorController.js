const asyncHandler = require('../middleware/asyncHandler');
const { ApiResponse } = require('../utils/ApiResponse');
const ApiError = require('../utils/ApiError');
const User = require('../models/User');
const Vendor = require('../models/Vendor');
const Trip = require('../models/Trip');
const Booking = require('../models/Booking');
const Review = require('../models/Review');

// @desc    List all vendors
// @route   GET /api/v1/vendors
// @access  Public
exports.list = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20, city, category, rating } = req.query;

  const query = { verificationStatus: 'verified' };
  if (city) query['address.city'] = new RegExp(city, 'i');
  if (category) query.categories = category;
  if (rating) query['stats.avgRating'] = { $gte: parseFloat(rating) };

  const vendors = await Vendor.find(query)
    .populate('user', 'name email profileImage')
    .limit(limit * 1)
    .skip((page - 1) * limit)
    .sort({ 'stats.avgRating': -1 });

  const total = await Vendor.countDocuments(query);

  res.json(new ApiResponse(200, vendors, 'Vendors retrieved successfully', {
    pagination: { total, page: parseInt(page), limit: parseInt(limit) }
  }));
});

// @desc    Get vendor by ID
// @route   GET /api/v1/vendors/:id
// @access  Public
exports.get = asyncHandler(async (req, res) => {
  const vendor = await Vendor.findById(req.params.id)
    .populate('user', 'name email profileImage phone createdAt');

  if (!vendor) {
    throw new ApiError(404, 'Vendor not found');
  }

  res.json(new ApiResponse(200, vendor, 'Vendor retrieved successfully'));
});

// @desc    Get vendor trips
// @route   GET /api/v1/vendors/:id/trips
// @access  Public
exports.getTrips = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20 } = req.query;

  const trips = await Trip.find({ vendor: req.params.id })
    .limit(limit * 1)
    .skip((page - 1) * limit)
    .sort({ createdAt: -1 });

  const total = await Trip.countDocuments({ vendor: req.params.id });

  res.json(new ApiResponse(200, trips, 'Vendor trips retrieved successfully', {
    pagination: { total, page: parseInt(page), limit: parseInt(limit) }
  }));
});

// @desc    Get vendor reviews
// @route   GET /api/v1/vendors/:id/reviews
// @access  Public
exports.getReviews = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20 } = req.query;

  const reviews = await Review.find({ vendor: req.params.id })
    .populate('user', 'name profileImage')
    .populate('trip', 'title')
    .limit(limit * 1)
    .skip((page - 1) * limit)
    .sort({ createdAt: -1 });

  const total = await Review.countDocuments({ vendor: req.params.id });

  res.json(new ApiResponse(200, reviews, 'Vendor reviews retrieved successfully', {
    pagination: { total, page: parseInt(page), limit: parseInt(limit) }
  }));
});

// @desc    Create vendor profile
// @route   POST /api/v1/vendors
// @access  Private
exports.create = asyncHandler(async (req, res) => {
  const vendorData = {
    ...req.body,
    user: req.user.id
  };

  const vendor = await Vendor.create(vendorData);
  await vendor.populate('user', 'name email');

  res.status(201).json(new ApiResponse(201, vendor, 'Vendor profile created successfully'));
});

// @desc    Update vendor profile
// @route   PUT /api/v1/vendors/:id
// @access  Private/Vendor
exports.update = asyncHandler(async (req, res) => {
  const vendor = await Vendor.findById(req.params.id);

  if (!vendor) {
    throw new ApiError(404, 'Vendor not found');
  }

  // Check ownership
  if (vendor.user.toString() !== req.user.id) {
    throw new ApiError(403, 'Not authorized to update this vendor profile');
  }

  const updatedVendor = await Vendor.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true, runValidators: true }
  ).populate('user', 'name email');

  res.json(new ApiResponse(200, updatedVendor, 'Vendor profile updated successfully'));
});

// @desc    Get vendor dashboard data
// @route   GET /api/v1/vendors/:id/dashboard
// @access  Private/Vendor
exports.getDashboard = asyncHandler(async (req, res) => {
  const vendorId = req.params.id;

  // Verify vendor ownership
  const vendor = await Vendor.findById(vendorId);
  if (!vendor || vendor.user.toString() !== req.user.id) {
    throw new ApiError(403, 'Not authorized');
  }

  const [totalTrips, totalBookings, totalEarnings, recentBookings] = await Promise.all([
    Trip.countDocuments({ vendor: vendor.user }),
    Booking.countDocuments({ vendor: vendor.user }),
    Booking.aggregate([
      { $match: { vendor: vendor.user, paymentStatus: 'completed' } },
      { $group: { _id: null, total: { $sum: '$vendorAmount' } } }
    ]),
    Booking.find({ vendor: vendor.user })
      .populate('user', 'name email')
      .populate('trip', 'title')
      .sort({ createdAt: -1 })
      .limit(5)
  ]);

  const dashboard = {
    stats: {
      totalTrips,
      totalBookings,
      totalEarnings: totalEarnings[0]?.total || 0,
      avgRating: vendor.stats?.avgRating || 0,
      totalReviews: vendor.stats?.totalReviews || 0
    },
    recentBookings
  };

  res.json(new ApiResponse(200, dashboard, 'Dashboard data retrieved successfully'));
});

// @desc    Get vendor bookings
// @route   GET /api/v1/vendors/:id/bookings
// @access  Private/Vendor
exports.getBookings = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20, status } = req.query;
  const vendorId = req.params.id;

  // Verify vendor ownership
  const vendor = await Vendor.findById(vendorId);
  if (!vendor || vendor.user.toString() !== req.user.id) {
    throw new ApiError(403, 'Not authorized');
  }

  const query = { vendor: vendor.user };
  if (status) query.status = status;

  const bookings = await Booking.find(query)
    .populate('user', 'name email phone')
    .populate('trip', 'title duration price')
    .limit(limit * 1)
    .skip((page - 1) * limit)
    .sort({ createdAt: -1 });

  const total = await Booking.countDocuments(query);

  res.json(new ApiResponse(200, bookings, 'Vendor bookings retrieved successfully', {
    pagination: { total, page: parseInt(page), limit: parseInt(limit) }
  }));
});

// @desc    Get vendor earnings
// @route   GET /api/v1/vendors/:id/earnings
// @access  Private/Vendor
exports.getEarnings = asyncHandler(async (req, res) => {
  const vendorId = req.params.id;

  // Verify vendor ownership
  const vendor = await Vendor.findById(vendorId);
  if (!vendor || vendor.user.toString() !== req.user.id) {
    throw new ApiError(403, 'Not authorized');
  }

  const earnings = await Booking.aggregate([
    { $match: { vendor: vendor.user, paymentStatus: 'completed' } },
    {
      $group: {
        _id: {
          year: { $year: '$createdAt' },
          month: { $month: '$createdAt' }
        },
        totalEarnings: { $sum: '$vendorAmount' },
        bookingCount: { $sum: 1 }
      }
    },
    { $sort: { '_id.year': -1, '_id.month': -1 } },
    { $limit: 12 }
  ]);

  res.json(new ApiResponse(200, earnings, 'Vendor earnings retrieved successfully'));
});

// @desc    Create Stripe Connect account
// @route   POST /api/v1/vendors/:id/stripe-account
// @access  Private/Vendor
exports.createStripeAccount = asyncHandler(async (req, res) => {
  const vendorId = req.params.id;

  const vendor = await Vendor.findById(vendorId);
  if (!vendor || vendor.user.toString() !== req.user.id) {
    throw new ApiError(403, 'Not authorized');
  }

  // Implementation would require Stripe API
  res.json(new ApiResponse(200, { message: 'Stripe account creation not implemented' }));
});

// @desc    Get Stripe account onboarding link
// @route   GET /api/v1/vendors/:id/stripe-account-link
// @access  Private/Vendor
exports.getStripeAccountLink = asyncHandler(async (req, res) => {
  res.json(new ApiResponse(200, { message: 'Stripe account link not implemented' }));
});

// @desc    Get Stripe login link
// @route   GET /api/v1/vendors/:id/stripe-login-link
// @access  Private/Vendor
exports.getStripeLoginLink = asyncHandler(async (req, res) => {
  res.json(new ApiResponse(200, { message: 'Stripe login link not implemented' }));
});

// @desc    Verify vendor (Admin only)
// @route   PATCH /api/v1/vendors/:id/verify
// @access  Private/Admin
exports.verifyVendor = asyncHandler(async (req, res) => {
  const { verificationStatus } = req.body;

  const vendor = await Vendor.findByIdAndUpdate(
    req.params.id,
    { verificationStatus },
    { new: true }
  ).populate('user', 'name email');

  if (!vendor) {
    throw new ApiError(404, 'Vendor not found');
  }

  res.json(new ApiResponse(200, vendor, 'Vendor verification updated successfully'));
});

// @desc    Update vendor subscription (Admin only)
// @route   PATCH /api/v1/vendors/:id/subscription
// @access  Private/Admin
exports.updateSubscription = asyncHandler(async (req, res) => {
  const vendor = await Vendor.findByIdAndUpdate(
    req.params.id,
    { subscription: req.body },
    { new: true }
  ).populate('user', 'name email');

  if (!vendor) {
    throw new ApiError(404, 'Vendor not found');
  }

  res.json(new ApiResponse(200, vendor, 'Vendor subscription updated successfully'));
});

// @desc    Get current vendor profile
// @route   GET /api/v1/vendors/me
// @access  Private
exports.getCurrentVendor = asyncHandler(async (req, res) => {
  const vendor = await Vendor.findOne({ user: req.user.id })
    .populate('user', 'name email profileImage phone createdAt');

  if (!vendor) {
    throw new ApiError(404, 'Vendor profile not found');
  }

  res.json(new ApiResponse(200, vendor, 'Current vendor profile retrieved successfully'));
});

exports.getVendor = exports.get; // Alias for backward compatibility
exports.listVendors = exports.list; // Alias for backward compatibility

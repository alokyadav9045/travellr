const asyncHandler = require('../middleware/asyncHandler');
const ApiError = require('../utils/ApiError');
const { ApiResponse } = require('../utils/ApiResponse');
const User = require('../models/User');
const Booking = require('../models/Booking');
const Review = require('../models/Review');
const Wishlist = require('../models/Wishlist');
const { cloudinary } = require('../config/cloudinary');
const mongoose = require('mongoose');

/**
 * @desc    Get customer profile
 * @route   GET /api/v1/customer/profile
 * @access  Private
 */
exports.getProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id).select('-password');
  
  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  res.json(new ApiResponse(200, { user }, 'Profile retrieved successfully'));
});

/**
 * @desc    Update customer profile
 * @route   PUT /api/v1/customer/profile
 * @access  Private
 */
exports.updateProfile = asyncHandler(async (req, res) => {
  const {
    name,
    phone,
    dateOfBirth,
    gender,
    address,
    city,
    state,
    country,
    zipCode,
    bio,
    preferences
  } = req.body;

  const user = await User.findById(req.user.id);

  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  // Validate user role
  if (user.role !== 'customer') {
    throw new ApiError(403, 'Access denied. Customer role required.');
  }

  // Update basic fields (adjust to match actual User schema)
  const updateData = {};
  if (name) updateData.name = name;
  if (phone) updateData.phone = phone;
  if (bio) updateData.bio = bio;
  
  // Handle address and other profile data based on actual schema
  if (address || city || state || country || zipCode || dateOfBirth || gender || preferences) {
    updateData.profile = {
      ...user.profile,
      ...(dateOfBirth && { dateOfBirth }),
      ...(gender && { gender }),
      ...(address && { address }),
      ...(city && { city }),
      ...(state && { state }),
      ...(country && { country }),
      ...(zipCode && { zipCode }),
      ...(preferences && { preferences: { ...user.profile?.preferences, ...preferences } })
    };
  }

  const updatedUser = await User.findByIdAndUpdate(
    req.user.id,
    updateData,
    { new: true, runValidators: true }
  ).select('-password');

  res.json(
    new ApiResponse(200, { user: updatedUser }, 'Profile updated successfully')
  );
});

/**
 * @desc    Upload profile picture
 * @route   POST /api/v1/customer/profile/picture
 * @access  Private
 */
exports.uploadProfilePicture = asyncHandler(async (req, res) => {
  if (!req.file) {
    throw new ApiError(400, 'Please upload an image');
  }

  const user = await User.findById(req.user.id);

  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  if (user.role !== 'customer') {
    throw new ApiError(403, 'Access denied. Customer role required.');
  }

  try {
    // Delete old picture from cloudinary if exists
    if (user.avatar?.publicId) {
      await cloudinary.uploader.destroy(user.avatar.publicId);
    }

    // Save new picture (using avatar field to match User schema)
    user.avatar = {
      url: req.file.path,
      publicId: req.file.filename
    };

    await user.save();

    res.json(
      new ApiResponse(200, { 
        avatar: user.avatar 
      }, 'Profile picture uploaded successfully')
    );
  } catch (error) {
    // If cloudinary deletion fails, still update user with new image
    user.avatar = {
      url: req.file.path,
      publicId: req.file.filename
    };
    await user.save();
    
    res.json(
      new ApiResponse(200, { 
        avatar: user.avatar 
      }, 'Profile picture uploaded successfully')
    );
  }
});

/**
 * @desc    Get customer bookings
 * @route   GET /api/v1/customer/bookings
 * @access  Private
 */
exports.getBookings = asyncHandler(async (req, res) => {
  const { status, page = 1, limit = 10 } = req.query;

  // Validate pagination parameters
  const pageNum = Math.max(1, parseInt(page));
  const limitNum = Math.min(50, Math.max(1, parseInt(limit))); // Max 50 items per page

  // Validate status if provided
  const validStatuses = ['pending', 'confirmed', 'completed', 'cancelled'];
  if (status && !validStatuses.includes(status)) {
    throw new ApiError(400, 'Invalid status parameter');
  }

  const query = { user: new mongoose.Types.ObjectId(req.user.id) };
  if (status) query.status = status;

  const bookings = await Booking.find(query)
    .populate('trip', 'title images price location')
    .populate('vendor', 'businessName')
    .sort({ createdAt: -1 })
    .limit(limitNum)
    .skip((pageNum - 1) * limitNum);

  const total = await Booking.countDocuments(query);

  res.json(
    new ApiResponse(200, {
      bookings,
      totalPages: Math.ceil(total / limitNum),
      currentPage: pageNum,
      total
    }, 'Bookings retrieved successfully')
  );
});

/**
 * @desc    Get booking details
 * @route   GET /api/v1/customer/bookings/:id
 * @access  Private
 */
exports.getBookingDetails = asyncHandler(async (req, res) => {
  const { id } = req.params;

  // Validate ObjectId
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, 'Invalid booking ID');
  }

  const booking = await Booking.findOne({
    _id: id,
    user: req.user.id
  })
    .populate('trip')
    .populate('vendor', 'businessName email phone')
    .populate('user', 'name email phone');

  if (!booking) {
    throw new ApiError(404, 'Booking not found');
  }

  res.json(
    new ApiResponse(200, { booking }, 'Booking details retrieved')
  );
});

/**
 * @desc    Get customer reviews
 * @route   GET /api/v1/customer/reviews
 * @access  Private
 */
exports.getReviews = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10 } = req.query;

  const reviews = await Review.find({ user: req.user.id })
    .populate('trip', 'title images')
    .sort({ createdAt: -1 })
    .limit(limit * 1)
    .skip((page - 1) * limit);

  const total = await Review.countDocuments({ user: req.user.id });

  res.json(
    new ApiResponse(200, {
      reviews,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    }, 'Reviews retrieved successfully')
  );
});

/**
 * @desc    Get wishlist
 * @route   GET /api/v1/customer/wishlist
 * @access  Private
 */
exports.getWishlist = asyncHandler(async (req, res) => {
  const { page = 1, limit = 12 } = req.query;

  const wishlist = await Wishlist.find({ user: req.user.id })
    .populate({
      path: 'trip',
      populate: {
        path: 'vendor',
        select: 'businessName'
      }
    })
    .sort({ createdAt: -1 })
    .limit(limit * 1)
    .skip((page - 1) * limit);

  const total = await Wishlist.countDocuments({ user: req.user.id });

  res.json(
    new ApiResponse(200, {
      wishlist,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    }, 'Wishlist retrieved successfully')
  );
});

/**
 * @desc    Get booking statistics
 * @route   GET /api/v1/customer/stats
 * @access  Private
 */
exports.getStatistics = asyncHandler(async (req, res) => {
  const userId = new mongoose.Types.ObjectId(req.user.id);

  // Get booking counts
  const bookingStats = await Booking.aggregate([
    { $match: { user: userId } },
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 },
        totalSpent: { $sum: { $ifNull: ['$totalPrice', 0] } }
      }
    }
  ]);

  // Get total bookings
  const totalBookings = await Booking.countDocuments({ user: userId });

  // Get total reviews
  const totalReviews = await Review.countDocuments({ user: userId });

  // Get wishlist count
  const wishlistCount = await Wishlist.countDocuments({ user: userId });

  // Format stats
  const stats = {
    totalBookings,
    totalReviews,
    wishlistCount,
    bookingsByStatus: bookingStats.reduce((acc, stat) => {
      acc[stat._id] = {
        count: stat.count,
        totalSpent: stat.totalSpent
      };
      return acc;
    }, {}),
    totalSpent: bookingStats.reduce((sum, stat) => sum + stat.totalSpent, 0)
  };

  res.json(
    new ApiResponse(200, { stats }, 'Statistics retrieved successfully')
  );
});

/**
 * @desc    Get upcoming trips
 * @route   GET /api/v1/customer/upcoming-trips
 * @access  Private
 */
exports.getUpcomingTrips = asyncHandler(async (req, res) => {
  const now = new Date();

  const upcomingBookings = await Booking.find({
    user: req.user.id,
    startDate: { $gte: now },
    status: { $in: ['confirmed', 'pending'] }
  })
    .populate('trip', 'title images price location duration')
    .populate('vendor', 'businessName phone')
    .sort({ startDate: 1 })
    .limit(10);

  res.json(
    new ApiResponse(200, {
      upcomingTrips: upcomingBookings
    }, 'Upcoming trips retrieved')
  );
});

/**
 * @desc    Get past trips
 * @route   GET /api/v1/customer/past-trips
 * @access  Private
 */
exports.getPastTrips = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  const now = new Date();

  const pastBookings = await Booking.find({
    user: req.user.id,
    endDate: { $lt: now },
    status: 'completed'
  })
    .populate('trip', 'title images price location')
    .populate('vendor', 'businessName')
    .sort({ endDate: -1 })
    .limit(limit * 1)
    .skip((page - 1) * limit);

  const total = await Booking.countDocuments({
    user: req.user.id,
    endDate: { $lt: now },
    status: 'completed'
  });

  res.json(
    new ApiResponse(200, {
      pastTrips: pastBookings,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    }, 'Past trips retrieved')
  );
});

/**
 * @desc    Delete account
 * @route   DELETE /api/v1/customer/account
 * @access  Private
 */
exports.deleteAccount = asyncHandler(async (req, res) => {
  const { password } = req.body;

  if (!password) {
    throw new ApiError(400, 'Password is required to delete account');
  }

  const user = await User.findById(req.user.id).select('+password');

  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  if (user.role !== 'customer') {
    throw new ApiError(403, 'Access denied. Customer role required.');
  }

  // Verify password using the correct method name from User model
  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    throw new ApiError(401, 'Invalid password');
  }

  // Check for active bookings
  const activeBookings = await Booking.countDocuments({
    user: req.user.id,
    status: { $in: ['pending', 'confirmed'] }
  });

  if (activeBookings > 0) {
    throw new ApiError(400, 'Cannot delete account with active bookings');
  }

  // Soft delete - mark as inactive
  user.isActive = false;
  user.deletedAt = new Date();
  await user.save();

  res.json(
    new ApiResponse(200, null, 'Account deleted successfully')
  );
});

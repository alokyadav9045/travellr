const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const asyncHandler = require('../middleware/asyncHandler');
const ApiResponse = require('../utils/ApiResponse');
const analyticsService = require('../services/analyticsService');
const emailService = require('../services/emailService');
const User = require('../models/User');
const Vendor = require('../models/Vendor');
const Trip = require('../models/Trip');
const Booking = require('../models/Booking');
const Payment = require('../models/Payment');
const Review = require('../models/Review');

// All routes require admin role
router.use(auth());

// @route   GET /api/admin/analytics
// @desc    Get platform analytics
// @access  Private/Admin
router.get('/analytics', asyncHandler(async (req, res) => {
  const { startDate, endDate } = req.query;

  const analytics = await analyticsService.getPlatformAnalytics(
    startDate ? new Date(startDate) : undefined,
    endDate ? new Date(endDate) : undefined
  );

  res.json(new ApiResponse(true, 'Analytics fetched successfully', analytics));
}));

// @route   GET /api/admin/users
// @desc    Get all users with filters
// @access  Private/Admin
router.get('/users', asyncHandler(async (req, res) => {
  const {
    page = 1,
    limit = 20,
    search,
    role,
    isVerified,
    sortBy = 'createdAt',
    sortOrder = 'desc',
  } = req.query;

  const query = {};

  if (search) {
    query.$or = [
      { name: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } },
    ];
  }

  if (role) query.role = role;
  if (isVerified !== undefined) query.isVerified = isVerified === 'true';

  const users = await User.find(query)
    .select('-password')
    .sort({ [sortBy]: sortOrder === 'desc' ? -1 : 1 })
    .limit(limit * 1)
    .skip((page - 1) * limit)
    .lean();

  const count = await User.countDocuments(query);

  res.json(
    new ApiResponse(true, 'Users fetched successfully', {
      users,
      totalPages: Math.ceil(count / limit),
      currentPage: parseInt(page),
      total: count,
    })
  );
}));

// @route   GET /api/admin/users/:id
// @desc    Get user details
// @access  Private/Admin
router.get('/users/:id', asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select('-password');

  if (!user) {
    return res.status(404).json(new ApiResponse(false, 'User not found'));
  }

  // Get user stats
  const bookingsCount = await Booking.countDocuments({ customer: user._id });
  const totalSpent = await Booking.aggregate([
    { $match: { customer: user._id, status: 'completed' } },
    { $group: { _id: null, total: { $sum: '$totalAmount' } } },
  ]);

  res.json(
    new ApiResponse(true, 'User fetched successfully', {
      user,
      stats: {
        bookingsCount,
        totalSpent: totalSpent[0]?.total || 0,
      },
    })
  );
}));

// @route   PATCH /api/admin/users/:id
// @desc    Update user
// @access  Private/Admin
router.patch('/users/:id', asyncHandler(async (req, res) => {
  const { role, isVerified, isActive } = req.body;

  const user = await User.findByIdAndUpdate(
    req.params.id,
    { role, isVerified, isActive },
    { new: true, runValidators: true }
  ).select('-password');

  if (!user) {
    return res.status(404).json(new ApiResponse(false, 'User not found'));
  }

  res.json(new ApiResponse(true, 'User updated successfully', { user }));
}));

// @route   DELETE /api/admin/users/:id
// @desc    Delete user
// @access  Private/Admin
router.delete('/users/:id', asyncHandler(async (req, res) => {
  const user = await User.findByIdAndDelete(req.params.id);

  if (!user) {
    return res.status(404).json(new ApiResponse(false, 'User not found'));
  }

  res.json(new ApiResponse(true, 'User deleted successfully'));
}));

// @route   GET /api/admin/vendors
// @desc    Get all vendors
// @access  Private/Admin
router.get('/vendors', asyncHandler(async (req, res) => {
  const {
    page = 1,
    limit = 20,
    status,
    search,
    sortBy = 'createdAt',
    sortOrder = 'desc',
  } = req.query;

  const query = {};
  if (status) query.status = status;
  if (search) {
    query.$or = [
      { businessName: { $regex: search, $options: 'i' } },
      { businessEmail: { $regex: search, $options: 'i' } },
    ];
  }

  const vendors = await Vendor.find(query)
    .populate('user', 'name email')
    .sort({ [sortBy]: sortOrder === 'desc' ? -1 : 1 })
    .limit(limit * 1)
    .skip((page - 1) * limit)
    .lean();

  const count = await Vendor.countDocuments(query);

  res.json(
    new ApiResponse(true, 'Vendors fetched successfully', {
      vendors,
      totalPages: Math.ceil(count / limit),
      currentPage: parseInt(page),
      total: count,
    })
  );
}));

// @route   PATCH /api/admin/vendors/:id/approve
// @desc    Approve vendor
// @access  Private/Admin
router.patch('/vendors/:id/approve', asyncHandler(async (req, res) => {
  const vendor = await Vendor.findByIdAndUpdate(
    req.params.id,
    { status: 'approved', verifiedAt: new Date() },
    { new: true }
  ).populate('user');

  if (!vendor) {
    return res.status(404).json(new ApiResponse(false, 'Vendor not found'));
  }

  // Send approval notification email
  try {
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #00B894; color: white; padding: 30px; text-align: center; }
            .content { padding: 30px; background: #f9f9f9; }
            .button { display: inline-block; padding: 12px 30px; background: #00B894; 
                      color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
            .features { list-style: none; padding: 0; }
            .features li { padding: 8px 0; }
            .features li:before { content: "✓ "; color: #00B894; font-weight: bold; margin-right: 10px; }
            .footer { padding: 20px; text-align: center; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Vendor Account Approved! 🎉</h1>
            </div>
            <div class="content">
              <p>Hi ${vendor.businessName},</p>
              <p>Congratulations! Your vendor account has been approved by our admin team.</p>
              <p>You can now:</p>
              <ul class="features">
                <li>Create and manage travel trips</li>
                <li>Accept bookings from customers</li>
                <li>Receive payments and manage payouts</li>
                <li>Access vendor analytics and dashboard</li>
              </ul>
              <p style="text-align: center;">
                <a href="${process.env.CLIENT_URL}/vendor/dashboard" class="button">Go to Vendor Dashboard</a>
              </p>
              <p>Welcome to the Travellr community! If you have any questions, feel free to contact our support team.</p>
            </div>
            <div class="footer">
              <p>&copy; ${new Date().getFullYear()} Travellr. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `;

    await emailService.sendEmail({
      to: vendor.user.email,
      subject: 'Your Vendor Account Has Been Approved!',
      html
    });
  } catch (error) {
    console.error('Error sending approval email:', error);
  }

  res.json(new ApiResponse(true, 'Vendor approved successfully', { vendor }));
}));

// @route   PATCH /api/admin/vendors/:id/reject
// @desc    Reject vendor
// @access  Private/Admin
router.patch('/vendors/:id/reject', asyncHandler(async (req, res) => {
  const { reason } = req.body;

  const vendor = await Vendor.findByIdAndUpdate(
    req.params.id,
    { status: 'rejected', rejectionReason: reason },
    { new: true }
  ).populate('user');

  if (!vendor) {
    return res.status(404).json(new ApiResponse(false, 'Vendor not found'));
  }

  // Send rejection notification email
  try {
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #E55A2B; color: white; padding: 30px; text-align: center; }
            .content { padding: 30px; background: #f9f9f9; }
            .reason-box { background: white; padding: 15px; border-radius: 5px; margin: 20px 0; border-left: 4px solid #E55A2B; }
            .button { display: inline-block; padding: 12px 30px; background: #FF6B35; 
                      color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
            .footer { padding: 20px; text-align: center; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Vendor Application Status</h1>
            </div>
            <div class="content">
              <p>Hi ${vendor.businessName},</p>
              <p>Thank you for applying to Travellr. After careful review, we regret to inform you that your vendor application has not been approved at this time.</p>
              ${reason ? `<div class="reason-box"><strong>Reason:</strong> ${reason}</div>` : ''}
              <p>This decision may have been based on factors such as business documentation, verification details, or compliance requirements.</p>
              <p>You may reapply after addressing the concerns mentioned above. Please contact our support team if you have any questions or need clarification.</p>
              <p style="text-align: center;">
                <a href="${process.env.CLIENT_URL}/support" class="button">Contact Support</a>
              </p>
              <p>We appreciate your interest in Travellr and look forward to potentially working together in the future.</p>
            </div>
            <div class="footer">
              <p>&copy; ${new Date().getFullYear()} Travellr. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `;

    await emailService.sendEmail({
      to: vendor.user.email,
      subject: 'Vendor Application Status Update',
      html
    });
  } catch (error) {
    console.error('Error sending rejection email:', error);
  }

  res.json(new ApiResponse(true, 'Vendor rejected', { vendor }));
}));

// @route   GET /api/admin/trips
// @desc    Get all trips
// @access  Private/Admin
router.get('/trips', asyncHandler(async (req, res) => {
  const {
    page = 1,
    limit = 20,
    status,
    category,
    search,
  } = req.query;

  const query = {};
  if (status) query.status = status;
  if (category) query.category = category;
  if (search) {
    query.$or = [
      { title: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } },
    ];
  }

  const trips = await Trip.find(query)
    .populate('vendor', 'businessName')
    .sort({ createdAt: -1 })
    .limit(limit * 1)
    .skip((page - 1) * limit)
    .lean();

  const count = await Trip.countDocuments(query);

  res.json(
    new ApiResponse(true, 'Trips fetched successfully', {
      trips,
      totalPages: Math.ceil(count / limit),
      currentPage: parseInt(page),
      total: count,
    })
  );
}));

// @route   PATCH /api/admin/trips/:id
// @desc    Update trip status
// @access  Private/Admin
router.patch('/trips/:id', asyncHandler(async (req, res) => {
  const { status, featured } = req.body;

  const trip = await Trip.findByIdAndUpdate(
    req.params.id,
    { status, featured },
    { new: true }
  );

  if (!trip) {
    return res.status(404).json(new ApiResponse(false, 'Trip not found'));
  }

  res.json(new ApiResponse(true, 'Trip updated successfully', { trip }));
}));

// @route   GET /api/admin/bookings
// @desc    Get all bookings
// @access  Private/Admin
router.get('/bookings', asyncHandler(async (req, res) => {
  const {
    page = 1,
    limit = 20,
    status,
    startDate,
    endDate,
  } = req.query;

  const query = {};
  if (status) query.status = status;
  if (startDate || endDate) {
    query.createdAt = {};
    if (startDate) query.createdAt.$gte = new Date(startDate);
    if (endDate) query.createdAt.$lte = new Date(endDate);
  }

  const bookings = await Booking.find(query)
    .populate('customer', 'name email')
    .populate('vendor', 'businessName')
    .sort({ createdAt: -1 })
    .limit(limit * 1)
    .skip((page - 1) * limit)
    .lean();

  const count = await Booking.countDocuments(query);

  res.json(
    new ApiResponse(true, 'Bookings fetched successfully', {
      bookings,
      totalPages: Math.ceil(count / limit),
      currentPage: parseInt(page),
      total: count,
    })
  );
}));

// @route   GET /api/admin/payments
// @desc    Get all payments
// @access  Private/Admin
router.get('/payments', asyncHandler(async (req, res) => {
  const {
    page = 1,
    limit = 20,
    status,
    startDate,
    endDate,
  } = req.query;

  const query = {};
  if (status) query.status = status;
  if (startDate || endDate) {
    query.createdAt = {};
    if (startDate) query.createdAt.$gte = new Date(startDate);
    if (endDate) query.createdAt.$lte = new Date(endDate);
  }

  const payments = await Payment.find(query)
    .populate('booking')
    .populate('user', 'name email')
    .sort({ createdAt: -1 })
    .limit(limit * 1)
    .skip((page - 1) * limit)
    .lean();

  const count = await Payment.countDocuments(query);

  res.json(
    new ApiResponse(true, 'Payments fetched successfully', {
      payments,
      totalPages: Math.ceil(count / limit),
      currentPage: parseInt(page),
      total: count,
    })
  );
}));

// @route   GET /api/admin/reviews
// @desc    Get all reviews
// @access  Private/Admin
router.get('/reviews', asyncHandler(async (req, res) => {
  const {
    page = 1,
    limit = 20,
    status,
    minRating,
  } = req.query;

  const query = {};
  if (status) query.status = status;
  if (minRating) query.rating = { $gte: parseInt(minRating) };

  const reviews = await Review.find(query)
    .populate('user', 'name')
    .populate('trip', 'title')
    .sort({ createdAt: -1 })
    .limit(limit * 1)
    .skip((page - 1) * limit)
    .lean();

  const count = await Review.countDocuments(query);

  res.json(
    new ApiResponse(true, 'Reviews fetched successfully', {
      reviews,
      totalPages: Math.ceil(count / limit),
      currentPage: parseInt(page),
      total: count,
    })
  );
}));

// @route   PATCH /api/admin/reviews/:id
// @desc    Update review status
// @access  Private/Admin
router.patch('/reviews/:id', asyncHandler(async (req, res) => {
  const { status } = req.body;

  const review = await Review.findByIdAndUpdate(
    req.params.id,
    { status },
    { new: true }
  );

  if (!review) {
    return res.status(404).json(new ApiResponse(false, 'Review not found'));
  }

  res.json(new ApiResponse(true, 'Review updated successfully', { review }));
}));

module.exports = router;

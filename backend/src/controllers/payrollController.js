const asyncHandler = require('../middleware/asyncHandler');
const ApiError = require('../utils/ApiError');
const { ApiResponse } = require('../utils/ApiResponse');
const Payout = require('../models/Payout');
const PayoutLedger = require('../models/PayoutLedger');
const Booking = require('../models/Booking');
const Vendor = require('../models/Vendor');
const payrollService = require('../services/payrollService');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

/**
 * @desc    Get vendor payouts
 * @route   GET /api/v1/payroll/payouts
 * @access  Private (Vendor)
 */
exports.getVendorPayouts = asyncHandler(async (req, res) => {
  const { status, page = 1, limit = 10 } = req.query;

  const vendor = await Vendor.findOne({ user: req.user.id });
  if (!vendor) {
    throw new ApiError(404, 'Vendor profile not found');
  }

  const query = { vendor: vendor._id };
  if (status) query.status = status;

  const payouts = await Payout.find(query)
    .populate('booking', 'bookingId trip startDate')
    .sort({ createdAt: -1 })
    .limit(limit * 1)
    .skip((page - 1) * limit);

  const total = await Payout.countDocuments(query);

  res.json(
    new ApiResponse(200, {
      payouts,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    }, 'Payouts retrieved successfully')
  );
});

/**
 * @desc    Get payout details
 * @route   GET /api/v1/payroll/payouts/:id
 * @access  Private (Vendor)
 */
exports.getPayoutDetails = asyncHandler(async (req, res) => {
  const payout = await Payout.findById(req.params.id)
    .populate({
      path: 'booking',
      populate: {
        path: 'trip user',
        select: 'title bookingId name email'
      }
    })
    .populate('vendor', 'businessName');

  if (!payout) {
    throw new ApiError(404, 'Payout not found');
  }

  // Check ownership
  const vendor = await Vendor.findOne({ user: req.user.id });
  if (payout.vendor.toString() !== vendor._id.toString()) {
    throw new ApiError(403, 'Not authorized to access this payout');
  }

  res.json(new ApiResponse(200, { payout }, 'Payout details retrieved'));
});

/**
 * @desc    Get payout ledger
 * @route   GET /api/v1/payroll/ledger
 * @access  Private (Vendor)
 */
exports.getPayoutLedger = asyncHandler(async (req, res) => {
  const { startDate, endDate, page = 1, limit = 20 } = req.query;

  const vendor = await Vendor.findOne({ user: req.user.id });
  if (!vendor) {
    throw new ApiError(404, 'Vendor profile not found');
  }

  const query = { vendor: vendor._id };

  if (startDate || endDate) {
    query.createdAt = {};
    if (startDate) query.createdAt.$gte = new Date(startDate);
    if (endDate) query.createdAt.$lte = new Date(endDate);
  }

  const ledgerEntries = await PayoutLedger.find(query)
    .populate('booking', 'bookingId')
    .populate('payout', 'amount status')
    .sort({ createdAt: -1 })
    .limit(limit * 1)
    .skip((page - 1) * limit);

  const total = await PayoutLedger.countDocuments(query);

  // Calculate summary
  const summary = await PayoutLedger.aggregate([
    { $match: { vendor: vendor._id } },
    {
      $group: {
        _id: '$type',
        total: { $sum: '$amount' }
      }
    }
  ]);

  res.json(
    new ApiResponse(200, {
      ledgerEntries,
      summary,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    }, 'Ledger retrieved successfully')
  );
});

/**
 * @desc    Request early payout
 * @route   POST /api/v1/payroll/request-payout
 * @access  Private (Vendor)
 */
exports.requestPayout = asyncHandler(async (req, res) => {
  const { bookingId } = req.body;

  const vendor = await Vendor.findOne({ user: req.user.id });
  if (!vendor) {
    throw new ApiError(404, 'Vendor profile not found');
  }

  const booking = await Booking.findById(bookingId);
  if (!booking) {
    throw new ApiError(404, 'Booking not found');
  }

  if (booking.vendor.toString() !== vendor._id.toString()) {
    throw new ApiError(403, 'Not authorized');
  }

  if (booking.paymentStatus !== 'paid') {
    throw new ApiError(400, 'Booking payment not completed');
  }

  // Check if payout already exists
  const existingPayout = await Payout.findOne({ booking: bookingId });
  if (existingPayout) {
    throw new ApiError(400, 'Payout already requested for this booking');
  }

  // Create payout request
  const payout = await payrollService.createPayout(booking, vendor);

  res.status(201).json(
    new ApiResponse(201, { payout }, 'Payout requested successfully')
  );
});

/**
 * @desc    Get financial summary
 * @route   GET /api/v1/payroll/summary
 * @access  Private (Vendor)
 */
exports.getFinancialSummary = asyncHandler(async (req, res) => {
  const { period = 'month' } = req.query;

  const vendor = await Vendor.findOne({ user: req.user.id });
  if (!vendor) {
    throw new ApiError(404, 'Vendor profile not found');
  }

  // Calculate date range
  const now = new Date();
  let startDate;

  switch (period) {
    case 'week':
      startDate = new Date(now.setDate(now.getDate() - 7));
      break;
    case 'month':
      startDate = new Date(now.setMonth(now.getMonth() - 1));
      break;
    case 'year':
      startDate = new Date(now.setFullYear(now.getFullYear() - 1));
      break;
    default:
      startDate = new Date(now.setMonth(now.getMonth() - 1));
  }

  // Get bookings
  const bookings = await Booking.find({
    vendor: vendor._id,
    paymentStatus: 'paid',
    createdAt: { $gte: startDate }
  });

  const totalRevenue = bookings.reduce((sum, b) => sum + b.totalPrice, 0);

  // Get payouts
  const payouts = await Payout.find({
    vendor: vendor._id,
    createdAt: { $gte: startDate }
  });

  const payoutsByStatus = {
    pending: payouts.filter(p => p.status === 'pending').reduce((sum, p) => sum + p.amount, 0),
    processing: payouts.filter(p => p.status === 'processing').reduce((sum, p) => sum + p.amount, 0),
    completed: payouts.filter(p => p.status === 'completed').reduce((sum, p) => sum + p.amount, 0),
    failed: payouts.filter(p => p.status === 'failed').reduce((sum, p) => sum + p.amount, 0)
  };

  const platformFees = bookings.reduce((sum, b) => {
    const commission = b.totalPrice * (vendor.commissionRate || 0.10);
    return sum + commission;
  }, 0);

  res.json(
    new ApiResponse(200, {
      period,
      totalRevenue,
      platformFees,
      netEarnings: totalRevenue - platformFees,
      payouts: payoutsByStatus,
      totalBookings: bookings.length
    }, 'Financial summary retrieved')
  );
});

/**
 * @desc    Process payout (Admin only)
 * @route   POST /api/v1/payroll/process/:id
 * @access  Private (Admin)
 */
exports.processPayout = asyncHandler(async (req, res) => {
  const payout = await Payout.findById(req.params.id)
    .populate('vendor', 'stripeAccountId businessName')
    .populate('booking', 'totalPrice');

  if (!payout) {
    throw new ApiError(404, 'Payout not found');
  }

  if (payout.status !== 'pending') {
    throw new ApiError(400, 'Payout already processed');
  }

  try {
    // Process with Stripe
    const transfer = await stripe.transfers.create({
      amount: Math.round(payout.amount * 100),
      currency: 'inr',
      destination: payout.vendor.stripeAccountId,
      transfer_group: payout.booking._id.toString()
    });

    payout.status = 'completed';
    payout.processedAt = new Date();
    payout.stripeTransferId = transfer.id;
    await payout.save();

    // Create ledger entry
    await PayoutLedger.create({
      vendor: payout.vendor._id,
      booking: payout.booking._id,
      payout: payout._id,
      type: 'credit',
      amount: payout.amount,
      description: `Payout for booking ${payout.booking._id}`,
      balance: 0 // Calculate from previous entries
    });

    res.json(
      new ApiResponse(200, { payout }, 'Payout processed successfully')
    );
  } catch (error) {
    payout.status = 'failed';
    payout.failureReason = error.message;
    await payout.save();

    throw new ApiError(500, `Payout failed: ${error.message}`);
  }
});

/**
 * @desc    Get all payouts (Admin)
 * @route   GET /api/v1/payroll/admin/payouts
 * @access  Private (Admin)
 */
exports.getAllPayouts = asyncHandler(async (req, res) => {
  const { status, vendor, page = 1, limit = 20 } = req.query;

  const query = {};
  if (status) query.status = status;
  if (vendor) query.vendor = vendor;

  const payouts = await Payout.find(query)
    .populate('vendor', 'businessName email')
    .populate('booking', 'bookingId totalPrice')
    .sort({ createdAt: -1 })
    .limit(limit * 1)
    .skip((page - 1) * limit);

  const total = await Payout.countDocuments(query);

  // Calculate totals
  const totals = await Payout.aggregate([
    { $match: query },
    {
      $group: {
        _id: '$status',
        total: { $sum: '$amount' },
        count: { $sum: 1 }
      }
    }
  ]);

  res.json(
    new ApiResponse(200, {
      payouts,
      totals,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    }, 'All payouts retrieved')
  );
});

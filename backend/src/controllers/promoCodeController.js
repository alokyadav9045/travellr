const PromoCode = require('../models/PromoCode');
const ApiError = require('../utils/ApiError');
const { ApiResponse } = require('../utils/ApiResponse');

// @desc    Create promo code (Admin only)
// @route   POST /api/v1/promo-codes
// @access  Private/Admin
exports.create = async (req, res) => {
  const {
    code,
    description,
    discountType,
    discountValue,
    maxDiscount,
    minPurchaseAmount,
    usageLimit,
    usagePerUser,
    validFrom,
    validUntil,
    applicableTrips,
    applicableVendors,
    applicableCategories,
    excludedVendors
  } = req.body;

  // Validate date range
  if (new Date(validFrom) >= new Date(validUntil)) {
    throw new ApiError(400, 'Valid from date must be before valid until date');
  }

  // Validate discount value
  if (discountType === 'percentage' && (discountValue < 0 || discountValue > 100)) {
    throw new ApiError(400, 'Percentage discount must be between 0 and 100');
  }

  if (discountType === 'fixed' && discountValue <= 0) {
    throw new ApiError(400, 'Fixed discount must be greater than 0');
  }

  const promoCode = await PromoCode.create({
    code: code.toUpperCase(),
    description,
    discountType,
    discountValue,
    maxDiscount,
    minPurchaseAmount,
    usageLimit,
    usagePerUser,
    validFrom: new Date(validFrom),
    validUntil: new Date(validUntil),
    applicableTrips,
    applicableVendors,
    applicableCategories,
    excludedVendors,
    createdBy: req.user.id
  });

  res.status(201).json(
    new ApiResponse(201, promoCode, 'Promo code created successfully')
  );
};

// @desc    Get all promo codes (Admin only)
// @route   GET /api/v1/promo-codes
// @access  Private/Admin
exports.list = async (req, res) => {
  const { page = 1, limit = 20, status, search } = req.query;

  const query = {};
  
  if (status === 'active') {
    const now = new Date();
    query.isActive = true;
    query.validFrom = { $lte: now };
    query.validUntil = { $gte: now };
  } else if (status === 'inactive') {
    query.isActive = false;
  } else if (status === 'expired') {
    query.validUntil = { $lt: new Date() };
  }

  if (search) {
    query.code = { $regex: search, $options: 'i' };
  }

  const promoCodes = await PromoCode.find(query)
    .limit(limit * 1)
    .skip((page - 1) * limit)
    .sort({ createdAt: -1 })
    .lean();

  const total = await PromoCode.countDocuments(query);

  res.json(
    new ApiResponse(200, {
      promoCodes,
      pagination: {
        total,
        page: Number(page),
        pages: Math.ceil(total / limit)
      }
    })
  );
};

// @desc    Get promo code by ID
// @route   GET /api/v1/promo-codes/:id
// @access  Private/Admin
exports.get = async (req, res) => {
  const promoCode = await PromoCode.findById(req.params.id)
    .populate('applicableTrips', 'title')
    .populate('applicableVendors', 'businessName')
    .populate('createdBy', 'name email');

  if (!promoCode) {
    throw new ApiError(404, 'Promo code not found');
  }

  res.json(new ApiResponse(200, promoCode));
};

// @desc    Validate promo code
// @route   POST /api/v1/promo-codes/validate
// @access  Public
exports.validate = async (req, res) => {
  const { code, amount, vendorId } = req.body;

  const promoCode = await PromoCode.findOne({ code: code.toUpperCase() });

  if (!promoCode) {
    throw new ApiError(404, 'Invalid promo code');
  }

  const validation = promoCode.isValid(amount, req.user?._id, vendorId);

  if (!validation.valid) {
    throw new ApiError(400, validation.message);
  }

  const discount = promoCode.calculateDiscount(amount);

  res.json(
    new ApiResponse(200, {
      code: promoCode.code,
      discountType: promoCode.discountType,
      discountValue: promoCode.discountValue,
      discount,
      finalAmount: amount - discount
    })
  );
};

// @desc    Update promo code
// @route   PATCH /api/v1/promo-codes/:id
// @access  Private/Admin
exports.update = async (req, res) => {
  const {
    description,
    discountValue,
    maxDiscount,
    minPurchaseAmount,
    usageLimit,
    usagePerUser,
    validFrom,
    validUntil,
    isActive,
    applicableTrips,
    applicableVendors,
    applicableCategories,
    excludedVendors
  } = req.body;

  const promoCode = await PromoCode.findById(req.params.id);

  if (!promoCode) {
    throw new ApiError(404, 'Promo code not found');
  }

  // Validate date range if updating dates
  if (validFrom && validUntil) {
    if (new Date(validFrom) >= new Date(validUntil)) {
      throw new ApiError(400, 'Valid from date must be before valid until date');
    }
    promoCode.validFrom = new Date(validFrom);
    promoCode.validUntil = new Date(validUntil);
  }

  if (description !== undefined) promoCode.description = description;
  if (discountValue !== undefined) promoCode.discountValue = discountValue;
  if (maxDiscount !== undefined) promoCode.maxDiscount = maxDiscount;
  if (minPurchaseAmount !== undefined) promoCode.minPurchaseAmount = minPurchaseAmount;
  if (usageLimit !== undefined) promoCode.usageLimit = usageLimit;
  if (usagePerUser !== undefined) promoCode.usagePerUser = usagePerUser;
  if (isActive !== undefined) promoCode.isActive = isActive;
  if (applicableTrips) promoCode.applicableTrips = applicableTrips;
  if (applicableVendors) promoCode.applicableVendors = applicableVendors;
  if (applicableCategories) promoCode.applicableCategories = applicableCategories;
  if (excludedVendors) promoCode.excludedVendors = excludedVendors;

  await promoCode.save();

  res.json(new ApiResponse(200, promoCode, 'Promo code updated successfully'));
};

// @desc    Delete promo code
// @route   DELETE /api/v1/promo-codes/:id
// @access  Private/Admin
exports.delete = async (req, res) => {
  const promoCode = await PromoCode.findByIdAndDelete(req.params.id);

  if (!promoCode) {
    throw new ApiError(404, 'Promo code not found');
  }

  res.json(new ApiResponse(200, null, 'Promo code deleted successfully'));
};

// @desc    Get promo code usage stats
// @route   GET /api/v1/promo-codes/:id/stats
// @access  Private/Admin
exports.getStats = async (req, res) => {
  const promoCode = await PromoCode.findById(req.params.id);

  if (!promoCode) {
    throw new ApiError(404, 'Promo code not found');
  }

  const stats = {
    code: promoCode.code,
    totalUsed: promoCode.usedCount,
    usageLimit: promoCode.usageLimit,
    usageRemaining: promoCode.usageLimit ? promoCode.usageLimit - promoCode.usedCount : null,
    totalDiscountGiven: promoCode.usedBy.reduce((sum, usage) => sum + (usage.discountApplied || 0), 0),
    uniqueUsers: new Set(promoCode.usedBy.map(u => u.userId.toString())).size,
    firstUsedAt: promoCode.usedBy.length > 0 ? promoCode.usedBy[0].usedAt : null,
    lastUsedAt: promoCode.usedBy.length > 0 ? promoCode.usedBy[promoCode.usedBy.length - 1].usedAt : null
  };

  res.json(new ApiResponse(200, stats));
};

const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const asyncHandler = require('../middleware/asyncHandler');
const promoCodeController = require('../controllers/promoCodeController');
const { validateRequest } = require('../middleware/validate');
const { z } = require('zod');

// Validation schemas
const createPromoCodeSchema = z.object({
  code: z.string().min(3).max(20).toUpperCase(),
  description: z.string().optional(),
  discountType: z.enum(['percentage', 'fixed']),
  discountValue: z.number().positive(),
  maxDiscount: z.number().optional(),
  minPurchaseAmount: z.number().default(0),
  usageLimit: z.number().optional(),
  usagePerUser: z.number().default(1),
  validFrom: z.string().datetime(),
  validUntil: z.string().datetime(),
  applicableTrips: z.array(z.string()).optional(),
  applicableVendors: z.array(z.string()).optional(),
  applicableCategories: z.array(z.string()).optional(),
  excludedVendors: z.array(z.string()).optional()
});

const validatePromoCodeSchema = z.object({
  code: z.string().min(3).max(20),
  amount: z.number().positive(),
  vendorId: z.string().optional()
});

// @route   POST /api/v1/promo-codes
// @desc    Create promo code
// @access  Private/Admin
router.post(
  '/',
  auth(),
  asyncHandler(promoCodeController.create)
);

// @route   GET /api/v1/promo-codes
// @desc    Get all promo codes
// @access  Private/Admin
router.get(
  '/',
  auth(),
  asyncHandler(promoCodeController.list)
);

// @route   GET /api/v1/promo-codes/:id
// @desc    Get promo code by ID
// @access  Private/Admin
router.get(
  '/:id',
  auth(),
  asyncHandler(promoCodeController.get)
);

// @route   POST /api/v1/promo-codes/validate
// @desc    Validate promo code
// @access  Public
router.post(
  '/validate',
  asyncHandler(promoCodeController.validate)
);

// @route   PATCH /api/v1/promo-codes/:id
// @desc    Update promo code
// @access  Private/Admin
router.patch(
  '/:id',
  auth(),
  asyncHandler(promoCodeController.update)
);

// @route   DELETE /api/v1/promo-codes/:id
// @desc    Delete promo code
// @access  Private/Admin
router.delete(
  '/:id',
  auth(),
  asyncHandler(promoCodeController.delete)
);

// @route   GET /api/v1/promo-codes/:id/stats
// @desc    Get promo code stats
// @access  Private/Admin
router.get(
  '/:id/stats',
  auth(),
  asyncHandler(promoCodeController.getStats)
);

module.exports = router;

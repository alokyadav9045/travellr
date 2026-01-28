const express = require('express');
const router = express.Router();
const vendorController = require('../controllers/vendorController');
const auth = require('../middleware/auth');
const asyncHandler = require('../middleware/asyncHandler');

// Public routes
router.get('/', asyncHandler(vendorController.list));
router.get('/:id', asyncHandler(vendorController.get));
router.get('/:id/trips', asyncHandler(vendorController.getTrips));
router.get('/:id/reviews', asyncHandler(vendorController.getReviews));

// Protected routes - Create vendor profile
router.post('/', auth(), asyncHandler(vendorController.create));
router.get('/me', auth(), asyncHandler(vendorController.getCurrentVendor));

// Protected routes - Vendor only
router.put('/:id', auth(), asyncHandler(vendorController.update));
router.get('/:id/dashboard', auth(), asyncHandler(vendorController.getDashboard));
router.get('/:id/bookings', auth(), asyncHandler(vendorController.getBookings));
router.get('/:id/earnings', auth(), asyncHandler(vendorController.getEarnings));

// Stripe Connect routes
router.post('/:id/stripe-account', auth(), asyncHandler(vendorController.createStripeAccount));
router.get('/:id/stripe-account-link', auth(), asyncHandler(vendorController.getStripeAccountLink));
router.get('/:id/stripe-login-link', auth(), asyncHandler(vendorController.getStripeLoginLink));

// Admin routes
router.patch('/:id/verify', auth(), asyncHandler(vendorController.verifyVendor));
router.patch('/:id/subscription', auth(), asyncHandler(vendorController.updateSubscription));

module.exports = router;

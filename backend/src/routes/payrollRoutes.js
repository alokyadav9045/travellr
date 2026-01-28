const express = require('express');
const router = express.Router();
const payrollController = require('../controllers/payrollController');
const auth = require('../middleware/auth');
const asyncHandler = require('../middleware/asyncHandler');

// Vendor routes
router.get('/payouts', auth(), asyncHandler(payrollController.getVendorPayouts));
router.get('/payouts/:id', auth(), asyncHandler(payrollController.getPayoutDetails));
router.get('/ledger', auth(), asyncHandler(payrollController.getPayoutLedger));
router.get('/summary', auth(), asyncHandler(payrollController.getFinancialSummary));
router.post('/request-payout', auth(), asyncHandler(payrollController.requestPayout));

// Admin routes
router.get('/admin/payouts', auth(), asyncHandler(payrollController.getAllPayouts));
router.post('/process/:id', auth(), asyncHandler(payrollController.processPayout));

module.exports = router;

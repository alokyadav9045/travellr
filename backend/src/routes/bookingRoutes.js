const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');
const auth = require('../middleware/auth');
const asyncHandler = require('../middleware/asyncHandler');

// Protected routes - Customer
router.post('/', auth(), asyncHandler(bookingController.create));
router.get('/my-bookings', auth(), asyncHandler(bookingController.listForUser));
router.post('/:id/calculate-price', auth(), asyncHandler(bookingController.calculatePrice));
router.get('/:id', auth(), asyncHandler(bookingController.get));
router.patch('/:id', auth(), asyncHandler(bookingController.update));
router.delete('/:id', auth(), asyncHandler(bookingController.cancel));
router.post('/:id/confirm-payment', auth(), asyncHandler(bookingController.confirmPayment));
router.post('/:id/request-refund', auth(), asyncHandler(bookingController.requestRefund));
router.get('/:id/invoice', auth(), asyncHandler(bookingController.downloadInvoice));
router.post('/:id/message', auth(), asyncHandler(bookingController.sendMessage));
router.get('/:id/messages', auth(), asyncHandler(bookingController.getMessages));

module.exports = router;

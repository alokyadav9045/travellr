const express = require('express');
const router = express.Router();
const webhookController = require('../controllers/webhookController');

// Health check
router.get('/health', webhookController.webhookHealth);

// Stripe webhook - raw body needed for signature verification
router.post(
  '/stripe',
  express.raw({ type: 'application/json' }),
  webhookController.handleStripeWebhook
);

module.exports = router;

const Stripe = require('stripe');
const env = require('./env');

const stripe = new Stripe(env.stripe.secretKey, {
  apiVersion: '2023-10-16',
  maxNetworkRetries: 2,
  timeout: 30000,
  telemetry: false,
});

module.exports = stripe;
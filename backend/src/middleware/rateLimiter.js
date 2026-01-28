const rateLimit = require('express-rate-limit');
const env = require('../config/env');

const limiter = rateLimit({
  windowMs: env.security.rateLimitWindowMs || 15 * 60 * 1000,
  max: env.security.rateLimitMaxRequests || 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: 'Too many requests, please try again later',
});

module.exports = limiter;

const express = require('express');
const router = express.Router();
const authRoutes = require('./authRoutes');
const tripRoutes = require('./tripRoutes');
const bookingRoutes = require('./bookingRoutes');
const vendorRoutes = require('./vendorRoutes');
const reviewRoutes = require('./reviewRoutes');
const notificationRoutes = require('./notificationRoutes');
const adminRoutes = require('./adminRoutes');
const wishlistRoutes = require('./wishlistRoutes');
const compareRoutes = require('./compareRoutes');
const payrollRoutes = require('./payrollRoutes');
const customerRoutes = require('./customerRoutes');
const webhookRoutes = require('./webhookRoutes');
const promoCodeRoutes = require('./promoCodeRoutes');

router.use('/auth', authRoutes);
router.use('/trips', tripRoutes);
router.use('/bookings', bookingRoutes);
router.use('/vendors', vendorRoutes);
router.use('/reviews', reviewRoutes);
router.use('/notifications', notificationRoutes);
router.use('/admin', adminRoutes);
router.use('/wishlist', wishlistRoutes);
router.use('/compare', compareRoutes);
router.use('/payroll', payrollRoutes);
router.use('/customer', customerRoutes);
router.use('/webhooks', webhookRoutes);
router.use('/promo-codes', promoCodeRoutes);
router.use('/contact', require('./contactRoutes'));

// Health check
router.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

module.exports = router;

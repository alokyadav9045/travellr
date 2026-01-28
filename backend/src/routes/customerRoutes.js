const express = require('express');
const router = express.Router();
const customerController = require('../controllers/customerController');
const auth = require('../middleware/auth');
const { uploadAvatar } = require('../middleware/upload');

// All routes require authentication
router.use(auth());

// Profile routes
router.get('/profile', customerController.getProfile);
router.put('/profile', customerController.updateProfile);
router.post('/profile/picture', uploadAvatar.single('picture'), customerController.uploadProfilePicture);

// Booking routes
router.get('/bookings', customerController.getBookings);
router.get('/bookings/:id', customerController.getBookingDetails);
router.get('/upcoming-trips', customerController.getUpcomingTrips);
router.get('/past-trips', customerController.getPastTrips);

// Reviews and wishlist
router.get('/reviews', customerController.getReviews);
router.get('/wishlist', customerController.getWishlist);

// Statistics
router.get('/stats', customerController.getStatistics);

// Account management
router.delete('/account', customerController.deleteAccount);

module.exports = router;

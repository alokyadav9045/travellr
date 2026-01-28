const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const auth = require('../middleware/auth');

router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/refresh-token', authController.refreshToken);
router.post('/forgot-password', authController.forgotPassword);
router.post('/reset-password/:token', authController.resetPassword);
router.get('/verify-email/:token', authController.verifyEmail);
router.get('/me', auth(), authController.getCurrentUser);
router.post('/logout', auth(), authController.logout);
router.post('/resend-verification', auth(), authController.resendVerification);
router.put('/update-password', auth(), authController.updatePassword);
router.post('/google', authController.googleLogin);
router.post('/facebook', authController.facebookLogin);

module.exports = router;

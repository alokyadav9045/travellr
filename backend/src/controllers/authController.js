const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const asyncHandler = require('../middleware/asyncHandler');
const ApiError = require('../utils/ApiError');
const { ApiResponse } = require('../utils/ApiResponse');
const User = require('../models/User');
const env = require('../config/env');
const emailService = require('../services/emailService');

const signToken = (user) => {
  return jwt.sign({ id: user._id.toString(), role: user.role }, env.jwt.secret, {
    expiresIn: env.jwt.expiresIn,
  });
};

const signRefreshToken = (user) => {
  return jwt.sign({ id: user._id.toString() }, env.jwt.refreshSecret, {
    expiresIn: '7d',
  });
};

exports.register = asyncHandler(async (req, res, next) => {
  const { name, email, password, role } = req.body;

  if (!name || !email || !password) {
    return next(ApiError.badRequest('Name, email and password are required'));
  }

  const existing = await User.findOne({ email });
  if (existing) return next(ApiError.conflict('Email already in use'));

  const emailToken = crypto.randomBytes(32).toString('hex');
  const user = await User.create({ name, email, password, role, emailVerificationToken: emailToken });
  const token = signToken(user);
  const refreshToken = signRefreshToken(user);

  // Send verification email
  try {
    await emailService.sendVerificationEmail(user, emailToken);
  } catch (error) {
    console.error('Failed to send verification email:', error);
  }

  return new ApiResponse(201, { 
    user: { id: user._id, name: user.name, email: user.email, role: user.role }, 
    token,
    refreshToken
  }, 'Registered successfully. Please check your email to verify your account.').send(res);
});

exports.login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) return next(ApiError.badRequest('Email and password are required'));

  const user = await User.findOne({ email }).select('+password');
  if (!user) return next(ApiError.unauthorized('Invalid credentials'));

  const match = await user.comparePassword(password);
  if (!match) return next(ApiError.unauthorized('Invalid credentials'));

  const token = signToken(user);
  const refreshToken = signRefreshToken(user);

  return new ApiResponse(200, { 
    user: { id: user._id, name: user.name, email: user.email, role: user.role }, 
    token,
    refreshToken
  }, 'Logged in').send(res);
});

exports.refreshToken = asyncHandler(async (req, res, next) => {
  const { refreshToken } = req.body;
  if (!refreshToken) return next(ApiError.badRequest('Refresh token required'));

  try {
    const decoded = jwt.verify(refreshToken, env.jwt.refreshSecret);
    const user = await User.findById(decoded.id);
    if (!user) return next(ApiError.unauthorized('Invalid refresh token'));

    const newToken = signToken(user);
    const newRefreshToken = signRefreshToken(user);

    return new ApiResponse(200, { token: newToken, refreshToken: newRefreshToken }).send(res);
  } catch (error) {
    return next(ApiError.unauthorized('Invalid refresh token'));
  }
});

exports.forgotPassword = asyncHandler(async (req, res, next) => {
  const { email } = req.body;
  if (!email) return next(ApiError.badRequest('Email required'));

  const user = await User.findOne({ email });
  if (!user) {
    // Don't reveal if user exists
    return new ApiResponse(200, null, 'If account exists, password reset email sent').send(res);
  }

  const resetToken = crypto.randomBytes(32).toString('hex');
  user.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');
  user.passwordResetExpires = Date.now() + 3600000; // 1 hour
  await user.save({ validateBeforeSave: false });

  try {
    await emailService.sendPasswordResetEmail(user, resetToken);
    return new ApiResponse(200, null, 'Password reset email sent').send(res);
  } catch (error) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });
    return next(ApiError.internal('Failed to send email'));
  }
});

exports.resetPassword = asyncHandler(async (req, res, next) => {
  const { token } = req.params;
  const { password } = req.body;

  if (!password) return next(ApiError.badRequest('Password required'));

  const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() }
  });

  if (!user) return next(ApiError.badRequest('Invalid or expired token'));

  user.password = password;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();

  const authToken = signToken(user);

  return new ApiResponse(200, { token: authToken }, 'Password reset successful').send(res);
});

exports.verifyEmail = asyncHandler(async (req, res, next) => {
  const { token } = req.params;

  const user = await User.findOne({ emailVerificationToken: token });
  if (!user) return next(ApiError.badRequest('Invalid verification token'));

  user.isEmailVerified = true;
  user.emailVerificationToken = undefined;
  await user.save({ validateBeforeSave: false });

  return new ApiResponse(200, null, 'Email verified successfully').send(res);
});

exports.getCurrentUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id).select('-password');
  return new ApiResponse(200, { user }).send(res);
});

exports.logout = asyncHandler(async (req, res) => {
  // In a real app, you'd invalidate the token in Redis or a blacklist
  return new ApiResponse(200, null, 'Logged out successfully').send(res);
});

exports.resendVerification = asyncHandler(async (req, res, next) => {
  const userId = req.user.id;
  const user = await User.findById(userId);
  
  if (!user) return next(ApiError.notFound('User not found'));
  if (user.isEmailVerified) return next(ApiError.badRequest('Email already verified'));
  
  const emailToken = crypto.randomBytes(32).toString('hex');
  user.emailVerificationToken = emailToken;
  await user.save({ validateBeforeSave: false });
  
  try {
    await emailService.sendVerificationEmail(user, emailToken);
    return new ApiResponse(200, null, 'Verification email sent').send(res);
  } catch (error) {
    user.emailVerificationToken = undefined;
    await user.save({ validateBeforeSave: false });
    return next(ApiError.internal('Failed to send verification email'));
  }
});

exports.updatePassword = asyncHandler(async (req, res, next) => {
  const userId = req.user.id;
  const { currentPassword, newPassword } = req.body;
  
  if (!currentPassword || !newPassword) {
    return next(ApiError.badRequest('Current and new passwords are required'));
  }
  
  const user = await User.findById(userId).select('+password');
  if (!user) return next(ApiError.notFound('User not found'));
  
  const isMatch = await user.comparePassword(currentPassword);
  if (!isMatch) return next(ApiError.unauthorized('Current password incorrect'));
  
  user.password = newPassword;
  await user.save();
  
  return new ApiResponse(200, null, 'Password updated successfully').send(res);
});

exports.googleLogin = asyncHandler(async (req, res, next) => {
  const { token } = req.body;
  if (!token) return next(ApiError.badRequest('Google token required'));
  
  try {
    const { OAuth2Client } = require('google-auth-library');
    const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
    const ticket = await client.verifyIdToken({ idToken: token });
    const payload = ticket.getPayload();
    
    let user = await User.findOne({ email: payload.email });
    if (!user) {
      user = await User.create({
        name: payload.name,
        email: payload.email,
        password: crypto.randomBytes(16).toString('hex'),
        isEmailVerified: payload.email_verified,
        role: 'customer'
      });
    }
    
    const authToken = signToken(user);
    const refreshToken = signRefreshToken(user);
    
    return new ApiResponse(200, { 
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
      token: authToken,
      refreshToken
    }, 'Google login successful').send(res);
  } catch (error) {
    return next(ApiError.unauthorized('Google login failed'));
  }
});

exports.facebookLogin = asyncHandler(async (req, res, next) => {
  const { token } = req.body;
  if (!token) return next(ApiError.badRequest('Facebook token required'));
  
  try {
    const axios = require('axios');
    const response = await axios.get(`https://graph.facebook.com/me?fields=id,name,email&access_token=${token}`);
    const { name, email } = response.data;
    
    if (!email) return next(ApiError.badRequest('Email required from Facebook'));
    
    let user = await User.findOne({ email });
    if (!user) {
      user = await User.create({
        name: name || 'Facebook User',
        email,
        password: crypto.randomBytes(16).toString('hex'),
        isEmailVerified: true,
        role: 'customer'
      });
    }
    
    const authToken = signToken(user);
    const refreshToken = signRefreshToken(user);
    
    return new ApiResponse(200, { 
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
      token: authToken,
      refreshToken
    }, 'Facebook login successful').send(res);
  } catch (error) {
    return next(ApiError.unauthorized('Facebook login failed'));
  }
});

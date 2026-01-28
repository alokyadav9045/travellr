const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const env = require('../config/env');

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, select: false },
    role: { type: String, enum: ['customer', 'vendor', 'admin'], default: 'customer' },
    avatar: { url: String, publicId: String },
    phone: { type: String },
    verified: { type: Boolean, default: false },
    isEmailVerified: { type: Boolean, default: false },
    isPhoneVerified: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    emailVerificationToken: { type: String },
    passwordResetToken: { type: String },
    passwordResetExpires: { type: Date },
    profile: {
      dateOfBirth: Date,
      gender: { type: String, enum: ['male', 'female', 'other'] },
      address: String,
      city: String,
      state: String,
      country: String,
      zipCode: String,
      bio: String,
      preferences: {
        currency: { type: String, default: 'INR' },
        language: { type: String, default: 'en' },
        notifications: {
          email: { type: Boolean, default: true },
          push: { type: Boolean, default: true },
          sms: { type: Boolean, default: false }
        }
      }
    },
    vendorDetails: {
      companyName: String,
      businessName: String,
      bio: String,
      gstNumber: String,
      panNumber: String,
      bankDetails: {
        accountNumber: String,
        ifscCode: String,
        bankName: String,
        accountHolderName: String
      },
      docs: [{ url: String, publicId: String }],
      tier: { type: String, enum: ['STARTER', 'PROFESSIONAL', 'ENTERPRISE'], default: 'STARTER' },
      commissionRate: { type: Number, default: 10 },
      isVerified: { type: Boolean, default: false },
      verifiedAt: Date,
      totalEarnings: { type: Number, default: 0 },
      totalTrips: { type: Number, default: 0 },
      totalBookings: { type: Number, default: 0 },
      averageRating: { type: Number, default: 0 },
      totalReviews: { type: Number, default: 0 }
    },
    lastLogin: { type: Date },
    deletedAt: { type: Date }
  },
  { timestamps: true }
);

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const saltRounds = env.security.bcryptSaltRounds || 12;
  this.password = await bcrypt.hash(this.password, saltRounds);
  next();
});

userSchema.methods.comparePassword = async function (candidate) {
  return bcrypt.compare(candidate, this.password);
};

// Index removed - already defined with unique: true above

module.exports = mongoose.model('User', userSchema);

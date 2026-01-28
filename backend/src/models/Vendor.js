const mongoose = require('mongoose');

const vendorSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  businessName: {
    type: String,
    required: [true, 'Business name is required'],
    trim: true,
    maxlength: [200, 'Business name cannot exceed 200 characters']
  },
  businessType: {
    type: String,
    enum: ['individual', 'company', 'agency'],
    required: true
  },
  description: {
    type: String,
    maxlength: [2000, 'Description cannot exceed 2000 characters']
  },
  logo: {
    url: String,
    publicId: String
  },
  coverImage: {
    url: String,
    publicId: String
  },
  
  // Contact Information
  contactEmail: {
    type: String,
    required: true,
    match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email']
  },
  contactPhone: {
    type: String,
    required: true
  },
  website: String,
  
  // Address
  address: {
    street: String,
    city: { type: String, required: true },
    state: String,
    country: { type: String, required: true },
    postalCode: String,
    coordinates: {
      type: { type: String, enum: ['Point'] },
      coordinates: [Number] // [longitude, latitude]
    }
  },
  
  // Business Documents
  documents: [{
    type: {
      type: String,
      enum: ['license', 'registration', 'insurance', 'tax', 'identity', 'other'],
      required: true
    },
    name: String,
    url: { type: String, required: true },
    publicId: String,
    verified: { type: Boolean, default: false },
    uploadedAt: { type: Date, default: Date.now }
  }],
  
  // Verification Status
  verificationStatus: {
    type: String,
    enum: ['pending', 'under_review', 'approved', 'rejected', 'suspended'],
    default: 'pending'
  },
  verificationNotes: String,
  verifiedAt: Date,
  verifiedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  
  // Stripe Connect
  stripeAccountId: String,
  stripeOnboardingComplete: { type: Boolean, default: false },
  stripeDetailsSubmitted: { type: Boolean, default: false },
  stripeChargesEnabled: { type: Boolean, default: false },
  stripePayoutsEnabled: { type: Boolean, default: false },
  
  // Subscription & Tier
  subscriptionTier: {
    type: String,
    enum: ['starter', 'professional', 'enterprise'],
    default: 'starter'
  },
  subscriptionStatus: {
    type: String,
    enum: ['active', 'inactive', 'trial', 'cancelled'],
    default: 'trial'
  },
  subscriptionExpiresAt: Date,
  commissionRate: {
    type: Number,
    default: 15, // Default 15% commission
    min: 0,
    max: 100
  },
  
  // Statistics
  stats: {
    totalTrips: { type: Number, default: 0 },
    activeTrips: { type: Number, default: 0 },
    totalBookings: { type: Number, default: 0 },
    totalRevenue: { type: Number, default: 0 },
    avgRating: { type: Number, default: 0 },
    totalReviews: { type: Number, default: 0 }
  },
  
  // Settings
  settings: {
    autoConfirmBookings: { type: Boolean, default: false },
    instantBooking: { type: Boolean, default: true },
    cancellationPolicy: {
      type: String,
      enum: ['flexible', 'moderate', 'strict'],
      default: 'moderate'
    },
    payoutSchedule: {
      type: String,
      enum: ['daily', 'weekly', 'monthly'],
      default: 'weekly'
    }
  },
  
  // Social Media
  socialMedia: {
    facebook: String,
    instagram: String,
    twitter: String,
    youtube: String,
    linkedin: String
  },
  
  // Metadata
  isActive: { type: Boolean, default: true },
  featuredUntil: Date,
  lastActiveAt: Date
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes
// vendorSchema.index({ user: 1 }); // Removed: user field already has unique: true
vendorSchema.index({ verificationStatus: 1 });
vendorSchema.index({ 'address.city': 1 });
vendorSchema.index({ 'address.country': 1 });
vendorSchema.index({ 'stats.avgRating': -1 });
vendorSchema.index({ createdAt: -1 });
vendorSchema.index({ 'address.coordinates': '2dsphere' });

// Virtual: Get all trips by this vendor
vendorSchema.virtual('trips', {
  ref: 'Trip',
  localField: '_id',
  foreignField: 'vendor'
});

// Pre-save middleware
vendorSchema.pre('save', function(next) {
  // Set commission rate based on subscription tier
  if (this.isModified('subscriptionTier')) {
    const commissionRates = {
      starter: 15,
      professional: 10,
      enterprise: 7
    };
    this.commissionRate = commissionRates[this.subscriptionTier];
  }
  next();
});

// Method to check if vendor can create more trips
vendorSchema.methods.canCreateTrip = function() {
  const tripLimits = {
    starter: 5,
    professional: 25,
    enterprise: Infinity
  };
  return this.stats.activeTrips < tripLimits[this.subscriptionTier];
};

// Method to check if vendor is fully verified
vendorSchema.methods.isFullyVerified = function() {
  return this.verificationStatus === 'approved' && 
         this.stripeOnboardingComplete && 
         this.stripePayoutsEnabled;
};

module.exports = mongoose.model('Vendor', vendorSchema);

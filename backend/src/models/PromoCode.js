const mongoose = require('mongoose');

const promoCodeSchema = new mongoose.Schema({
  code: {
    type: String,
    required: [true, 'Promo code is required'],
    unique: true,
    uppercase: true,
    trim: true,
    minlength: [3, 'Code must be at least 3 characters'],
    maxlength: [20, 'Code cannot exceed 20 characters']
  },

  description: {
    type: String,
    trim: true
  },

  discountType: {
    type: String,
    enum: ['percentage', 'fixed'],
    required: [true, 'Discount type is required'],
    default: 'percentage'
  },

  discountValue: {
    type: Number,
    required: [true, 'Discount value is required'],
    min: [0, 'Discount value cannot be negative']
  },

  // For percentage: max 100, for fixed: amount in cents
  maxDiscount: {
    type: Number,
    min: [0, 'Max discount cannot be negative']
  },

  minPurchaseAmount: {
    type: Number,
    default: 0,
    min: [0, 'Minimum purchase amount cannot be negative']
  },

  usageLimit: {
    type: Number,
    default: null, // null means unlimited
    min: [1, 'Usage limit must be at least 1']
  },

  usagePerUser: {
    type: Number,
    default: 1,
    min: [1, 'Usage per user must be at least 1']
  },

  validFrom: {
    type: Date,
    required: [true, 'Valid from date is required']
  },

  validUntil: {
    type: Date,
    required: [true, 'Valid until date is required']
  },

  applicableTrips: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Trip'
  }],

  applicableVendors: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Vendor'
  }],

  applicableCategories: [{
    type: String
  }],

  excludedVendors: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Vendor'
  }],

  usedCount: {
    type: Number,
    default: 0
  },

  usedBy: [{
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    usedAt: Date,
    bookingId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Booking'
    },
    discountApplied: Number
  }],

  isActive: {
    type: Boolean,
    default: true
  },

  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

// Indexes (code already has unique: true so no need for separate index)
promoCodeSchema.index({ validFrom: 1, validUntil: 1 });
promoCodeSchema.index({ isActive: 1 });

// Check if promo code is valid
promoCodeSchema.methods.isValid = function(purchaseAmount = 0, userId = null, vendorId = null) {
  const now = new Date();

  // Check if code is active
  if (!this.isActive) {
    return { valid: false, message: 'Promo code is not active' };
  }

  // Check date validity
  if (now < this.validFrom) {
    return { valid: false, message: 'Promo code is not yet valid' };
  }

  if (now > this.validUntil) {
    return { valid: false, message: 'Promo code has expired' };
  }

  // Check usage limit
  if (this.usageLimit && this.usedCount >= this.usageLimit) {
    return { valid: false, message: 'Promo code usage limit exceeded' };
  }

  // Check user usage limit
  if (userId && this.usagePerUser) {
    const userUsageCount = this.usedBy.filter(
      u => u.userId.toString() === userId.toString()
    ).length;
    if (userUsageCount >= this.usagePerUser) {
      return { valid: false, message: 'You have already used this promo code' };
    }
  }

  // Check minimum purchase amount
  if (purchaseAmount < this.minPurchaseAmount) {
    return {
      valid: false,
      message: `Minimum purchase amount of ${this.minPurchaseAmount} required`
    };
  }

  // Check vendor eligibility (if applicable)
  if (vendorId) {
    if (this.excludedVendors && this.excludedVendors.length > 0) {
      if (this.excludedVendors.some(id => id.toString() === vendorId.toString())) {
        return { valid: false, message: 'This promo code is not applicable for this vendor' };
      }
    }

    if (this.applicableVendors && this.applicableVendors.length > 0) {
      if (!this.applicableVendors.some(id => id.toString() === vendorId.toString())) {
        return { valid: false, message: 'This promo code is not applicable for this vendor' };
      }
    }
  }

  return { valid: true };
};

// Calculate discount amount
promoCodeSchema.methods.calculateDiscount = function(amount) {
  let discount = 0;

  if (this.discountType === 'percentage') {
    discount = (amount * this.discountValue) / 100;
    if (this.maxDiscount) {
      discount = Math.min(discount, this.maxDiscount);
    }
  } else if (this.discountType === 'fixed') {
    discount = this.discountValue;
  }

  return Math.min(discount, amount);
};

// Record usage
promoCodeSchema.methods.recordUsage = async function(userId, bookingId, discountApplied) {
  this.usedCount += 1;
  this.usedBy.push({
    userId,
    usedAt: new Date(),
    bookingId,
    discountApplied
  });
  return this.save();
};

module.exports = mongoose.model('PromoCode', promoCodeSchema);

const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema(
  {
    bookingNumber: {
      type: String,
      unique: true,
      sparse: true
    },

    trip: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Trip',
      required: [true, 'Trip is required']
    },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User is required']
    },

    vendor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Vendor',
      required: [true, 'Vendor is required']
    },

    // Guest Information
    totalGuests: {
      type: Number,
      required: [true, 'Number of guests is required'],
      min: [1, 'At least 1 guest is required']
    },

    guestDetails: {
      leadGuest: {
        firstName: String,
        lastName: String,
        email: String,
        phone: String,
        dateOfBirth: Date,
        nationality: String
      },
      additionalGuests: [
        {
          firstName: String,
          lastName: String,
          dateOfBirth: Date,
          relationship: String
        }
      ],
      specialRequests: String
    },

    // Dates
    departure: {
      startDate: Date,
      endDate: Date,
      departureId: mongoose.Schema.Types.ObjectId
    },

    // Pricing Information
    basePrice: {
      type: Number,
      required: [true, 'Base price is required'],
      min: [0, 'Price cannot be negative']
    },

    platformFee: {
      type: Number,
      default: 0,
      min: [0, 'Fee cannot be negative']
    },

    discount: {
      type: Number,
      default: 0,
      min: [0, 'Discount cannot be negative']
    },

    appliedPromoCode: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'PromoCode'
    },

    totalPrice: {
      type: Number,
      required: [true, 'Total price is required'],
      min: [0, 'Total price cannot be negative']
    },

    vendorAmount: {
      type: Number,
      required: [true, 'Vendor amount is required'],
      min: [0, 'Vendor amount cannot be negative']
    },

    // Payment Information
    paymentIntentId: {
      type: String,
      unique: true,
      sparse: true
    },

    paymentStatus: {
      type: String,
      enum: ['pending', 'completed', 'failed', 'refunded'],
      default: 'pending'
    },

    paymentMethod: {
      type: String,
      enum: ['stripe', 'paypal', 'bank_transfer'],
      default: 'stripe'
    },

    // Booking Status
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'completed', 'cancelled'],
      default: 'pending'
    },

    // Cancellation Information
    cancellationDate: Date,

    refundAmount: {
      type: Number,
      default: 0,
      min: [0, 'Refund amount cannot be negative']
    },

    refundStatus: {
      type: String,
      enum: ['none', 'requested', 'pending', 'processed', 'failed', 'not_applicable'],
      default: 'none'
    },

    refundReason: String,

    // Additional Information
    notes: String,
    internalNotes: String,

    // Timestamps
    confirmedAt: Date,
    completedAt: Date,

    // Review Information
    reviewed: {
      type: Boolean,
      default: false
    },

    reviewId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Review'
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Indexes
bookingSchema.index({ user: 1, createdAt: -1 });
bookingSchema.index({ vendor: 1, createdAt: -1 });
bookingSchema.index({ trip: 1 });
bookingSchema.index({ status: 1 });
bookingSchema.index({ paymentStatus: 1 });

// Generate booking number before saving
bookingSchema.pre('save', async function(next) {
  if (!this.bookingNumber) {
    const count = await mongoose.model('Booking').countDocuments();
    const timestamp = Date.now().toString().slice(-6);
    this.bookingNumber = `TRV-${timestamp}-${count + 1}`;
  }
  next();
});

// Virtual for pricing summary
bookingSchema.virtual('pricingSummary').get(function() {
  return {
    basePrice: this.basePrice,
    platformFee: this.platformFee,
    discount: this.discount,
    totalPrice: this.totalPrice,
    vendorAmount: this.vendorAmount
  };
});

// Virtual for refund eligibility
bookingSchema.virtual('isRefundable').get(function() {
  return this.refundStatus === 'none' && ['pending', 'confirmed'].includes(this.status);
});

module.exports = mongoose.model('Booking', bookingSchema);

const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  booking: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Booking',
    required: true
  },
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  vendor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Vendor',
    required: true
  },
  
  // Payment Details
  amount: { type: Number, required: true },
  currency: { type: String, default: 'INR' },
  type: {
    type: String,
    enum: ['full_payment', 'deposit', 'balance', 'refund'],
    required: true
  },
  
  // Stripe
  stripePaymentIntentId: { type: String, unique: true, sparse: true },
  stripeChargeId: String,
  stripeTransferId: String,
  stripeRefundId: String,
  
  // Status
  status: {
    type: String,
    enum: ['pending', 'processing', 'succeeded', 'failed', 'refunded', 'disputed', 'cancelled'],
    default: 'pending'
  },
  
  // Payment Method
  paymentMethod: {
    type: String,
    enum: ['card', 'bank_transfer', 'paypal', 'wallet']
  },
  paymentMethodDetails: {
    brand: String,
    last4: String,
    expiryMonth: Number,
    expiryYear: Number,
    bankName: String,
    accountLast4: String
  },
  
  // Fees
  fees: {
    stripeFee: Number,
    platformFee: Number,
    totalFees: Number
  },
  
  // Net Amount (after fees)
  netAmount: Number,
  
  // Refund Details
  refund: {
    amount: Number,
    reason: String,
    requestedAt: Date,
    processedAt: Date,
    status: {
      type: String,
      enum: ['none', 'pending', 'succeeded', 'failed']
    }
  },
  
  // Error handling
  failureCode: String,
  failureMessage: String,
  
  // Metadata
  metadata: mongoose.Schema.Types.Mixed,
  ipAddress: String,
  userAgent: String,
  
  // Timestamps
  processedAt: Date,
  settledAt: Date
}, {
  timestamps: true
});

// Indexes
paymentSchema.index({ booking: 1 });
paymentSchema.index({ customer: 1 });
paymentSchema.index({ vendor: 1 });
paymentSchema.index({ status: 1 });
// paymentSchema.index({ stripePaymentIntentId: 1 }); // Removed: field has unique: true now
paymentSchema.index({ createdAt: -1 });

// Static: Get payment stats
paymentSchema.statics.getPaymentStats = async function(filter = {}) {
  return this.aggregate([
    { $match: filter },
    {
      $group: {
        _id: null,
        totalPayments: { $sum: 1 },
        totalAmount: { $sum: '$amount' },
        succeededPayments: {
          $sum: { $cond: [{ $eq: ['$status', 'succeeded'] }, 1, 0] }
        },
        failedPayments: {
          $sum: { $cond: [{ $eq: ['$status', 'failed'] }, 1, 0] }
        },
        refundedPayments: {
          $sum: { $cond: [{ $eq: ['$status', 'refunded'] }, 1, 0] }
        },
        totalRefunded: {
          $sum: { $cond: [{ $eq: ['$status', 'refunded'] }, '$refund.amount', 0] }
        }
      }
    }
  ]);
};

module.exports = mongoose.model('Payment', paymentSchema);

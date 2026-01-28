module.exports = {
  // User Roles
  ROLES: {
    CUSTOMER: 'customer',
    VENDOR: 'vendor',
    ADMIN: 'admin',
  },

  // Verification Status
  VERIFICATION_STATUS: {
    PENDING: 'pending',
    IN_REVIEW: 'in_review',
    VERIFIED: 'verified',
    REJECTED: 'rejected',
  },

  // Trip Status
  TRIP_STATUS: {
    DRAFT: 'draft',
    PENDING_REVIEW: 'pending_review',
    PUBLISHED: 'published',
    SUSPENDED: 'suspended',
    ARCHIVED: 'archived',
  },

  // Booking Status
  BOOKING_STATUS: {
    PENDING: 'pending',
    CONFIRMED: 'confirmed',
    CANCELLED: 'cancelled',
    COMPLETED: 'completed',
    REFUNDED: 'refunded',
    NO_SHOW: 'no_show',
  },

  // Payment Status
  PAYMENT_STATUS: {
    PENDING: 'pending',
    PROCESSING: 'processing',
    PAID: 'paid',
    FAILED: 'failed',
    REFUNDED: 'refunded',
    PARTIALLY_REFUNDED: 'partially_refunded',
  },

  // Payout Status
  PAYOUT_STATUS: {
    HOLD: 'hold',
    READY: 'ready',
    PROCESSING: 'processing',
    PAID: 'paid',
    FAILED: 'failed',
    CANCELLED: 'cancelled',
  },

  // ... minimal subset; add more as needed
};

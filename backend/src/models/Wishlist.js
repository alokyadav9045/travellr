const mongoose = require('mongoose');

const wishlistSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    trip: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Trip',
      required: true,
    },
    notes: {
      type: String,
      maxlength: 500,
    },
  },
  {
    timestamps: true,
  }
);

// Compound index to prevent duplicate wishlists
wishlistSchema.index({ user: 1, trip: 1 }, { unique: true });

// Static method to toggle wishlist
wishlistSchema.statics.toggle = async function(userId, tripId, notes = '') {
  const existing = await this.findOne({ user: userId, trip: tripId });

  if (existing) {
    await existing.deleteOne();
    return { added: false, wishlist: null };
  } else {
    const wishlist = await this.create({ user: userId, trip: tripId, notes });
    return { added: true, wishlist };
  }
};

// Get user's wishlist with trip details
wishlistSchema.statics.getUserWishlist = async function(userId, options = {}) {
  const { page = 1, limit = 20 } = options;

  const wishlist = await this.find({ user: userId })
    .populate({
      path: 'trip',
      populate: { path: 'vendor', select: 'businessName' },
    })
    .sort({ createdAt: -1 })
    .limit(limit)
    .skip((page - 1) * limit)
    .lean();

  const count = await this.countDocuments({ user: userId });

  return {
    items: wishlist,
    total: count,
    pages: Math.ceil(count / limit),
    currentPage: page,
  };
};

// Check if trip is in wishlist
wishlistSchema.statics.isInWishlist = async function(userId, tripId) {
  const exists = await this.exists({ user: userId, trip: tripId });
  return !!exists;
};

module.exports = mongoose.model('Wishlist', wishlistSchema);

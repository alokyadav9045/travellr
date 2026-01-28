const mongoose = require('mongoose');

const dateSchema = new mongoose.Schema(
  {
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    price: { type: Number, required: true },
    originalPrice: { type: Number },
    seats: { type: Number, default: 0 },
    availableSeats: { type: Number, default: 0 },
    bookedSeats: { type: Number, default: 0 },
    status: { type: String, enum: ['available', 'full', 'cancelled'], default: 'available' }
  },
  { _id: true }
);

const itinerarySchema = new mongoose.Schema(
  {
    day: { type: Number, required: true },
    title: { type: String, required: true },
    description: { type: String },
    activities: [String],
    meals: {
      breakfast: { type: Boolean, default: false },
      lunch: { type: Boolean, default: false },
      dinner: { type: Boolean, default: false }
    },
    accommodation: { type: String }
  },
  { _id: false }
);

const tripSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, index: true },
    vendor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    shortDescription: { type: String, maxlength: 200 },
    description: { type: String },
    highlights: [String],

    // Location details
    location: { type: String },
    startLocation: { type: String },
    endLocation: { type: String },
    coordinates: {
      lat: Number,
      lng: Number
    },

    // Trip metadata
    category: { type: String, enum: ['adventure', 'cultural', 'religious', 'nature', 'beach', 'mountain', 'wildlife', 'heritage', 'wellness', 'other'], index: true },
    difficulty: { type: String, enum: ['easy', 'moderate', 'challenging', 'extreme'], default: 'moderate' },
    duration: {
      days: { type: Number, required: true },
      nights: { type: Number, required: true }
    },
    groupSize: {
      min: { type: Number, default: 1 },
      max: { type: Number, default: 20 }
    },

    // Pricing
    price: { type: Number, required: true },
    originalPrice: { type: Number },
    currency: { type: String, default: 'INR' },

    // Media
    images: [{ url: String, publicId: String, caption: String, isPrimary: Boolean }],
    thumbnail: { url: String, publicId: String },
    videos: [{ url: String, publicId: String }],

    // Dates and availability
    dates: [dateSchema],

    // Itinerary
    itinerary: [itinerarySchema],

    // Inclusions/Exclusions
    inclusions: [String],
    exclusions: [String],

    // Policies
    cancellationPolicy: {
      type: { type: String, enum: ['flexible', 'moderate', 'strict'], default: 'moderate' },
      refundPercentage: { type: Number, default: 50 },
      daysBeforeTrip: { type: Number, default: 7 },
      description: String
    },

    // Requirements
    requirements: [String],
    thingsToCarry: [String],

    // Status
    status: { type: String, enum: ['draft', 'pending', 'published', 'archived', 'rejected'], default: 'draft', index: true },
    isActive: { type: Boolean, default: true },
    isFeatured: { type: Boolean, default: false, index: true },

    // Stats
    stats: {
      bookings: { type: Number, default: 0 },
      bookingsCount: { type: Number, default: 0 },
      views: { type: Number, default: 0 },
      rating: { type: Number, default: 0 },
      reviewCount: { type: Number, default: 0 },
      wishlistCount: { type: Number, default: 0 }
    },

    // SEO
    metaTitle: String,
    metaDescription: String,
    tags: [String],

    // Admin fields
    rejectionReason: String,
    publishedAt: Date,
    deletedAt: Date
  },
  { timestamps: true }
);

// Indexes for search and filtering
tripSchema.index({ title: 'text', description: 'text', location: 'text', tags: 'text' });
tripSchema.index({ price: 1 });
tripSchema.index({ 'dates.startDate': 1 });
tripSchema.index({ createdAt: -1 });

// Virtual for discount percentage
tripSchema.virtual('discountPercentage').get(function () {
  if (this.originalPrice && this.originalPrice > this.price) {
    return Math.round(((this.originalPrice - this.price) / this.originalPrice) * 100);
  }
  return 0;
});

// Ensure virtuals are included in JSON
tripSchema.set('toJSON', { virtuals: true });
tripSchema.set('toObject', { virtuals: true });

// Check availability method
tripSchema.methods.isAvailable = function (selectedDate, guests) {
  const dateStr = new Date(selectedDate).toISOString().split('T')[0];
  const dateObj = this.dates.find(d =>
    new Date(d.startDate).toISOString().split('T')[0] === dateStr
  );

  if (!dateObj) return false;
  return (dateObj.availableSeats || 0) >= guests;
};

module.exports = mongoose.model('Trip', tripSchema);

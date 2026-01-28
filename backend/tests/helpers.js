// Test utilities and helpers
const mongoose = require('mongoose');

class TestHelper {
  static async connectDB() {
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(process.env.MONGO_URI);
    }
  }

  static async disconnectDB() {
    if (mongoose.connection.readyState === 1) {
      await mongoose.disconnect();
    }
  }

  static async clearDatabase() {
    const collections = mongoose.connection.collections;
    for (const key in collections) {
      await collections[key].deleteMany({});
    }
  }

  static generateMockToken(userId, role = 'customer') {
    const jwt = require('jsonwebtoken');
    return jwt.sign(
      { id: userId, role },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );
  }

  static createMockUser(overrides = {}) {
    return {
      _id: new mongoose.Types.ObjectId(),
      name: 'Test User',
      email: 'test@example.com',
      password: 'hashed_password',
      role: 'customer',
      verified: true,
      createdAt: new Date(),
      updatedAt: new Date(),
      ...overrides
    };
  }

  static createMockTrip(overrides = {}) {
    return {
      _id: new mongoose.Types.ObjectId(),
      title: 'Test Trip',
      slug: 'test-trip',
      vendor: new mongoose.Types.ObjectId(),
      description: 'Test description',
      location: { country: 'India', state: 'Goa' },
      price: 50000,
      duration: 5,
      images: ['image1.jpg'],
      itinerary: ['Day 1', 'Day 2'],
      highlights: ['Beach', 'Adventure'],
      reviews: [],
      rating: 4.5,
      status: 'active',
      createdAt: new Date(),
      updatedAt: new Date(),
      ...overrides
    };
  }

  static createMockBooking(overrides = {}) {
    return {
      _id: new mongoose.Types.ObjectId(),
      bookingNumber: 'BK' + Date.now(),
      trip: new mongoose.Types.ObjectId(),
      customer: new mongoose.Types.ObjectId(),
      numberOfGuests: 2,
      selectedDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      status: 'pending',
      pricing: {
        basePrice: 50000,
        platformFee: 5000,
        discount: 0,
        totalPrice: 55000
      },
      payment: {
        paymentStatus: 'pending',
        paymentIntentId: null
      },
      createdAt: new Date(),
      updatedAt: new Date(),
      ...overrides
    };
  }

  static createMockPromoCode(overrides = {}) {
    return {
      _id: new mongoose.Types.ObjectId(),
      code: 'TEST20',
      description: 'Test promo',
      discountType: 'percentage',
      discountValue: 20,
      maxDiscount: 10000,
      minPurchaseAmount: 10000,
      usageLimit: 100,
      usagePerUser: 1,
      validFrom: new Date(),
      validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      usedCount: 0,
      usedByUsers: [],
      active: true,
      createdAt: new Date(),
      updatedAt: new Date(),
      ...overrides
    };
  }

  static mockApiResponse(status = 200, data = {}) {
    return {
      status,
      data: {
        success: true,
        data,
        message: 'Success'
      }
    };
  }

  static mockApiError(status = 400, message = 'Error') {
    return {
      response: {
        status,
        data: {
          success: false,
          error: { message }
        }
      }
    };
  }
}

module.exports = TestHelper;

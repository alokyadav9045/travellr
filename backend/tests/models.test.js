const request = require('supertest');
const TestHelper = require('./helpers');

// Assuming you have a User model test
describe('User Model Tests', () => {
  beforeAll(async () => {
    await TestHelper.connectDB();
  });

  afterEach(async () => {
    await TestHelper.clearDatabase();
  });

  afterAll(async () => {
    await TestHelper.disconnectDB();
  });

  test('should create a user with valid data', async () => {
    const userData = TestHelper.createMockUser();
    const User = require('../../src/models/User');
    
    const user = await User.create(userData);
    
    expect(user).toBeDefined();
    expect(user.email).toBe('test@example.com');
    expect(user.role).toBe('customer');
  });

  test('should hash password before saving', async () => {
    const User = require('../../src/models/User');
    const userData = TestHelper.createMockUser({
      password: 'plaintext123'
    });
    
    const user = await User.create(userData);
    
    expect(user.password).not.toBe('plaintext123');
  });

  test('should fail validation without email', async () => {
    const User = require('../../src/models/User');
    const userData = TestHelper.createMockUser({ email: undefined });
    
    await expect(User.create(userData)).rejects.toThrow();
  });

  test('should prevent duplicate emails', async () => {
    const User = require('../../src/models/User');
    const userData = TestHelper.createMockUser();
    
    await User.create(userData);
    
    await expect(User.create(userData)).rejects.toThrow();
  });
});

describe('PromoCode Model Tests', () => {
  beforeAll(async () => {
    await TestHelper.connectDB();
  });

  afterEach(async () => {
    await TestHelper.clearDatabase();
  });

  afterAll(async () => {
    await TestHelper.disconnectDB();
  });

  test('should create valid promo code', async () => {
    const PromoCode = require('../src/models/PromoCode');
    const promoData = TestHelper.createMockPromoCode();
    
    const promo = await PromoCode.create(promoData);
    
    expect(promo.code).toBe('TEST20');
    expect(promo.active).toBe(true);
  });

  test('should validate percentage discount', async () => {
    const PromoCode = require('../src/models/PromoCode');
    const promo = await PromoCode.create(
      TestHelper.createMockPromoCode({
        discountType: 'percentage',
        discountValue: 25,
        maxDiscount: 5000
      })
    );
    
    expect(promo.isValid()).toBe(true);
  });

  test('should calculate percentage discount correctly', async () => {
    const PromoCode = require('../src/models/PromoCode');
    const promo = await PromoCode.create(
      TestHelper.createMockPromoCode({
        discountType: 'percentage',
        discountValue: 20
      })
    );
    
    const discount = promo.calculateDiscount(50000);
    
    expect(discount).toBe(10000);
  });

  test('should calculate fixed discount correctly', async () => {
    const PromoCode = require('../src/models/PromoCode');
    const promo = await PromoCode.create(
      TestHelper.createMockPromoCode({
        discountType: 'fixed',
        discountValue: 5000
      })
    );
    
    const discount = promo.calculateDiscount(50000);
    
    expect(discount).toBe(5000);
  });

  test('should respect max discount limit', async () => {
    const PromoCode = require('../src/models/PromoCode');
    const promo = await PromoCode.create(
      TestHelper.createMockPromoCode({
        discountType: 'percentage',
        discountValue: 50,
        maxDiscount: 5000
      })
    );
    
    const discount = promo.calculateDiscount(50000);
    
    expect(discount).toBeLessThanOrEqual(5000);
  });

  test('should track usage correctly', async () => {
    const PromoCode = require('../src/models/PromoCode');
    const userId = new (require('mongoose').Types.ObjectId)();
    const promo = await PromoCode.create(TestHelper.createMockPromoCode());
    
    await promo.recordUsage(userId);
    
    expect(promo.usedCount).toBe(1);
    expect(promo.usedByUsers).toContain(userId);
  });

  test('should respect usage per user limit', async () => {
    const PromoCode = require('../src/models/PromoCode');
    const userId = new (require('mongoose').Types.ObjectId)();
    const promo = await PromoCode.create(
      TestHelper.createMockPromoCode({ usagePerUser: 1 })
    );
    
    await promo.recordUsage(userId);
    
    const canUse = !promo.usedByUsers.includes(userId.toString());
    expect(canUse).toBe(false);
  });
});

describe('Booking Model Tests', () => {
  beforeAll(async () => {
    await TestHelper.connectDB();
  });

  afterEach(async () => {
    await TestHelper.clearDatabase();
  });

  afterAll(async () => {
    await TestHelper.disconnectDB();
  });

  test('should create booking with valid data', async () => {
    const Booking = require('../src/models/Booking');
    const bookingData = TestHelper.createMockBooking();
    
    const booking = await Booking.create(bookingData);
    
    expect(booking).toBeDefined();
    expect(booking.status).toBe('pending');
  });

  test('should auto-generate booking number', async () => {
    const Booking = require('../src/models/Booking');
    const booking = await Booking.create(TestHelper.createMockBooking());
    
    expect(booking.bookingNumber).toBeDefined();
    expect(booking.bookingNumber.startsWith('BK')).toBe(true);
  });

  test('should calculate correct total price', async () => {
    const Booking = require('../src/models/Booking');
    const booking = await Booking.create(
      TestHelper.createMockBooking({
        pricing: {
          basePrice: 50000,
          platformFee: 5000,
          discount: 5000,
          totalPrice: 50000
        }
      })
    );
    
    const expectedTotal = 50000 + 5000 - 5000;
    expect(booking.pricing.totalPrice).toBe(expectedTotal);
  });
});

const request = require('supertest');
const mongoose = require('mongoose');
const TestHelper = require('./helpers');

let app;
let server;

describe('Integration Tests - Booking Flow', () => {
  beforeAll(async () => {
    await TestHelper.connectDB();
    // Import app after DB connection
    app = require('../src/app');
    server = app.listen(5001);
  });

  afterEach(async () => {
    await TestHelper.clearDatabase();
  });

  afterAll(async () => {
    server.close();
    await TestHelper.disconnectDB();
  });

  describe('Complete Booking Workflow', () => {
    test('should complete full booking workflow without promo', async () => {
      // 1. Register user
      const registerRes = await request(app)
        .post('/api/v1/auth/register')
        .send({
          name: 'Test Customer',
          email: 'customer@example.com',
          password: 'SecurePass123',
          role: 'customer'
        });

      expect(registerRes.status).toBe(201);
      const token = registerRes.body.data.token;

      // 2. Get available trips
      const tripsRes = await request(app)
        .get('/api/v1/trips')
        .query({ page: 1, limit: 10 });

      expect(tripsRes.status).toBe(200);
      const trip = tripsRes.body.data[0];

      // 3. Create booking
      const bookingRes = await request(app)
        .post('/api/v1/bookings')
        .set('Authorization', `Bearer ${token}`)
        .send({
          trip: trip._id,
          numberOfGuests: 2,
          selectedDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
        });

      expect(bookingRes.status).toBe(201);
      expect(bookingRes.body.data).toHaveProperty('bookingNumber');
      expect(bookingRes.body.data.pricing.totalPrice).toBeGreaterThan(0);

      // 4. Process payment (mock)
      const paymentRes = await request(app)
        .post('/api/v1/bookings/' + bookingRes.body.data._id + '/payment')
        .set('Authorization', `Bearer ${token}`)
        .send({
          paymentIntentId: 'pi_test_123',
          paymentMethod: 'card'
        });

      expect(paymentRes.status).toBe(200);

      // 5. Verify booking status
      const bookingCheckRes = await request(app)
        .get('/api/v1/bookings/' + bookingRes.body.data._id)
        .set('Authorization', `Bearer ${token}`);

      expect(bookingCheckRes.status).toBe(200);
      expect(bookingCheckRes.body.data.status).toBe('confirmed');
    });

    test('should complete booking with promo code', async () => {
      // 1. Register user
      const registerRes = await request(app)
        .post('/api/v1/auth/register')
        .send({
          name: 'Test Customer',
          email: 'customer2@example.com',
          password: 'SecurePass123',
          role: 'customer'
        });

      const token = registerRes.body.data.token;

      // 2. Register admin and create promo code
      const adminRes = await request(app)
        .post('/api/v1/auth/register')
        .send({
          name: 'Admin User',
          email: 'admin@example.com',
          password: 'AdminPass123',
          role: 'admin'
        });

      const adminToken = adminRes.body.data.token;

      const promoRes = await request(app)
        .post('/api/v1/promo-codes')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          code: 'SUMMER20',
          discountType: 'percentage',
          discountValue: 20,
          maxDiscount: 10000,
          usageLimit: 100,
          validFrom: new Date(),
          validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
        });

      expect(promoRes.status).toBe(201);

      // 3. Validate promo code
      const validateRes = await request(app)
        .post('/api/v1/promo-codes/validate')
        .send({
          code: 'SUMMER20',
          amount: 50000
        });

      expect(validateRes.status).toBe(200);
      expect(validateRes.body.data.discount).toBeGreaterThan(0);

      // 4. Get trip
      const tripsRes = await request(app).get('/api/v1/trips?limit=1');
      const trip = tripsRes.body.data[0];

      // 5. Create booking with promo
      const bookingRes = await request(app)
        .post('/api/v1/bookings')
        .set('Authorization', `Bearer ${token}`)
        .send({
          trip: trip._id,
          numberOfGuests: 2,
          selectedDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
          promoCode: 'SUMMER20'
        });

      expect(bookingRes.status).toBe(201);
      expect(bookingRes.body.data.pricing.discount).toBeGreaterThan(0);
      expect(bookingRes.body.data.appliedPromoCode).toBe('SUMMER20');
    });
  });

  describe('Promo Code Validation', () => {
    test('should reject expired promo code', async () => {
      // Create admin
      const adminRes = await request(app)
        .post('/api/v1/auth/register')
        .send({
          name: 'Admin',
          email: 'admin@test.com',
          password: 'AdminPass123',
          role: 'admin'
        });

      const adminToken = adminRes.body.data.token;

      // Create expired promo
      const promoRes = await request(app)
        .post('/api/v1/promo-codes')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          code: 'EXPIRED',
          discountType: 'percentage',
          discountValue: 10,
          validFrom: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000),
          validUntil: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)
        });

      expect(promoRes.status).toBe(201);

      // Try to validate expired promo
      const validateRes = await request(app)
        .post('/api/v1/promo-codes/validate')
        .send({
          code: 'EXPIRED',
          amount: 50000
        });

      expect(validateRes.status).toBe(400);
    });

    test('should reject promo with usage limit exceeded', async () => {
      const adminRes = await request(app)
        .post('/api/v1/auth/register')
        .send({
          name: 'Admin',
          email: 'admin2@test.com',
          password: 'AdminPass123',
          role: 'admin'
        });

      const adminToken = adminRes.body.data.token;

      // Create promo with limit 1
      const promoRes = await request(app)
        .post('/api/v1/promo-codes')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          code: 'LIMITED',
          discountType: 'fixed',
          discountValue: 5000,
          usageLimit: 1,
          validFrom: new Date(),
          validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
        });

      expect(promoRes.status).toBe(201);

      // Try to use multiple times (first use)
      const validate1 = await request(app)
        .post('/api/v1/promo-codes/validate')
        .send({
          code: 'LIMITED',
          amount: 50000
        });

      expect(validate1.status).toBe(200);

      // Second use should fail
      const validate2 = await request(app)
        .post('/api/v1/promo-codes/validate')
        .send({
          code: 'LIMITED',
          amount: 50000
        });

      expect(validate2.status).toBe(400);
    });
  });

  describe('Payment Flow', () => {
    test('should handle successful payment', async () => {
      const registerRes = await request(app)
        .post('/api/v1/auth/register')
        .send({
          name: 'Test User',
          email: 'payment@test.com',
          password: 'Pass123',
          role: 'customer'
        });

      const token = registerRes.body.data.token;

      // Get trip
      const tripsRes = await request(app).get('/api/v1/trips?limit=1');
      const trip = tripsRes.body.data[0];

      // Create booking
      const bookingRes = await request(app)
        .post('/api/v1/bookings')
        .set('Authorization', `Bearer ${token}`)
        .send({
          trip: trip._id,
          numberOfGuests: 1,
          selectedDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
        });

      const bookingId = bookingRes.body.data._id;

      // Process payment
      const paymentRes = await request(app)
        .post(`/api/v1/bookings/${bookingId}/payment`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          paymentIntentId: 'pi_success_123',
          paymentMethod: 'card'
        });

      expect(paymentRes.status).toBe(200);

      // Verify booking is confirmed
      const checkRes = await request(app)
        .get(`/api/v1/bookings/${bookingId}`)
        .set('Authorization', `Bearer ${token}`);

      expect(checkRes.body.data.status).toBe('confirmed');
      expect(checkRes.body.data.payment.paymentStatus).toBe('completed');
    });

    test('should handle payment failure', async () => {
      const registerRes = await request(app)
        .post('/api/v1/auth/register')
        .send({
          name: 'Test User 2',
          email: 'payment2@test.com',
          password: 'Pass123',
          role: 'customer'
        });

      const token = registerRes.body.data.token;

      // Get trip
      const tripsRes = await request(app).get('/api/v1/trips?limit=1');
      const trip = tripsRes.body.data[0];

      // Create booking
      const bookingRes = await request(app)
        .post('/api/v1/bookings')
        .set('Authorization', `Bearer ${token}`)
        .send({
          trip: trip._id,
          numberOfGuests: 1,
          selectedDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
        });

      const bookingId = bookingRes.body.data._id;

      // Process payment with failure
      const paymentRes = await request(app)
        .post(`/api/v1/bookings/${bookingId}/payment`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          paymentIntentId: 'pi_fail_123',
          paymentMethod: 'card'
        });

      expect(paymentRes.status).toBe(400);

      // Verify booking is still pending
      const checkRes = await request(app)
        .get(`/api/v1/bookings/${bookingId}`)
        .set('Authorization', `Bearer ${token}`);

      expect(checkRes.body.data.status).toBe('pending');
    });
  });

  describe('Authorization & Security', () => {
    test('should reject request without token', async () => {
      const res = await request(app)
        .get('/api/v1/bookings');

      expect(res.status).toBe(401);
    });

    test('should reject invalid token', async () => {
      const res = await request(app)
        .get('/api/v1/bookings')
        .set('Authorization', 'Bearer invalid_token_123');

      expect(res.status).toBe(401);
    });

    test('should prevent customer access to admin endpoints', async () => {
      const customerRes = await request(app)
        .post('/api/v1/auth/register')
        .send({
          name: 'Customer',
          email: 'customer3@test.com',
          password: 'Pass123',
          role: 'customer'
        });

      const token = customerRes.body.data.token;

      const res = await request(app)
        .post('/api/v1/promo-codes')
        .set('Authorization', `Bearer ${token}`)
        .send({
          code: 'TEST',
          discountType: 'percentage',
          discountValue: 10
        });

      expect(res.status).toBe(403);
    });
  });
});

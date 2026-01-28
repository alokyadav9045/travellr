# 🧪 Testing Guide

Complete testing guide for the Travellr platform.

## 📋 Table of Contents

1. [Test Setup](#test-setup)
2. [Backend Testing](#backend-testing)
3. [Frontend Testing](#frontend-testing)
4. [Integration Testing](#integration-testing)
5. [E2E Testing](#e2e-testing)
6. [Load Testing](#load-testing)
7. [Security Testing](#security-testing)

---

## 🛠️ Test Setup

### Install Dependencies

```bash
# Backend
cd backend
npm install --save-dev jest supertest @faker-js/faker

# Frontend
cd frontend
npm install --save-dev @testing-library/react @testing-library/jest-dom @testing-library/user-event vitest
```

### Test Environment

Create `.env.test` file:
```env
NODE_ENV=test
MONGO_URI=mongodb://localhost:27017/travellr_test
REDIS_URL=redis://localhost:6379
JWT_SECRET=test-secret
```

---

## 🔧 Backend Testing

### Unit Tests

#### Testing Controllers

```javascript
// tests/unit/authController.test.js
const request = require('supertest');
const app = require('../../src/app');
const User = require('../../src/models/User');

describe('Auth Controller', () => {
  beforeEach(async () => {
    await User.deleteMany({});
  });

  describe('POST /api/v1/auth/register', () => {
    it('should register a new user', async () => {
      const userData = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'Password123!',
        role: 'customer'
      };

      const res = await request(app)
        .post('/api/v1/auth/register')
        .send(userData)
        .expect(201);

      expect(res.body.success).toBe(true);
      expect(res.body.data.user).toHaveProperty('email', userData.email);
      expect(res.body.data).toHaveProperty('token');
    });

    it('should not register with existing email', async () => {
      await User.create({
        name: 'Existing User',
        email: 'existing@example.com',
        password: 'Password123!'
      });

      const res = await request(app)
        .post('/api/v1/auth/register')
        .send({
          name: 'New User',
          email: 'existing@example.com',
          password: 'Password123!'
        })
        .expect(400);

      expect(res.body.success).toBe(false);
    });
  });

  describe('POST /api/v1/auth/login', () => {
    it('should login with valid credentials', async () => {
      const user = await User.create({
        name: 'Test User',
        email: 'test@example.com',
        password: 'Password123!'
      });

      const res = await request(app)
        .post('/api/v1/auth/login')
        .send({
          email: 'test@example.com',
          password: 'Password123!'
        })
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('token');
    });

    it('should not login with invalid credentials', async () => {
      const res = await request(app)
        .post('/api/v1/auth/login')
        .send({
          email: 'test@example.com',
          password: 'wrongpassword'
        })
        .expect(401);

      expect(res.body.success).toBe(false);
    });
  });
});
```

#### Testing Services

```javascript
// tests/unit/emailService.test.js
const emailService = require('../../src/services/emailService');
const nodemailer = require('nodemailer');

jest.mock('nodemailer');

describe('Email Service', () => {
  let sendMailMock;

  beforeEach(() => {
    sendMailMock = jest.fn().mockResolvedValue({ messageId: '123' });
    nodemailer.createTransport.mockReturnValue({
      sendMail: sendMailMock
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('sendWelcomeEmail', () => {
    it('should send welcome email', async () => {
      await emailService.sendWelcomeEmail('test@example.com', 'Test User');

      expect(sendMailMock).toHaveBeenCalledWith(
        expect.objectContaining({
          to: 'test@example.com',
          subject: expect.stringContaining('Welcome')
        })
      );
    });
  });

  describe('sendBookingConfirmation', () => {
    it('should send booking confirmation', async () => {
      const booking = {
        user: { email: 'test@example.com', name: 'Test User' },
        trip: { title: 'Mountain Trek' },
        bookingId: 'BOOK123',
        totalPrice: 299
      };

      await emailService.sendBookingConfirmation(booking);

      expect(sendMailMock).toHaveBeenCalled();
    });
  });
});
```

#### Testing Models

```javascript
// tests/unit/userModel.test.js
const User = require('../../src/models/User');
const mongoose = require('mongoose');

describe('User Model', () => {
  it('should create user with valid data', async () => {
    const userData = {
      name: 'Test User',
      email: 'test@example.com',
      password: 'Password123!',
      role: 'customer'
    };

    const user = await User.create(userData);

    expect(user.name).toBe(userData.name);
    expect(user.email).toBe(userData.email);
    expect(user.password).not.toBe(userData.password); // Should be hashed
  });

  it('should not create user without required fields', async () => {
    const user = new User({});

    await expect(user.save()).rejects.toThrow();
  });

  it('should generate JWT token', () => {
    const user = new User({
      _id: new mongoose.Types.ObjectId(),
      name: 'Test User',
      email: 'test@example.com'
    });

    const token = user.getSignedJwtToken();
    expect(token).toBeDefined();
    expect(typeof token).toBe('string');
  });

  it('should match password correctly', async () => {
    const user = await User.create({
      name: 'Test User',
      email: 'test@example.com',
      password: 'Password123!'
    });

    const isMatch = await user.matchPassword('Password123!');
    expect(isMatch).toBe(true);

    const isNotMatch = await user.matchPassword('wrongpassword');
    expect(isNotMatch).toBe(false);
  });
});
```

### Integration Tests

```javascript
// tests/integration/booking.test.js
const request = require('supertest');
const app = require('../../src/app');
const User = require('../../src/models/User');
const Trip = require('../../src/models/Trip');
const Booking = require('../../src/models/Booking');

describe('Booking Flow Integration', () => {
  let customerToken;
  let vendorToken;
  let trip;

  beforeAll(async () => {
    // Create customer
    const customer = await User.create({
      name: 'Customer',
      email: 'customer@example.com',
      password: 'Password123!',
      role: 'customer'
    });
    customerToken = customer.getSignedJwtToken();

    // Create vendor
    const vendor = await User.create({
      name: 'Vendor',
      email: 'vendor@example.com',
      password: 'Password123!',
      role: 'vendor'
    });
    vendorToken = vendor.getSignedJwtToken();

    // Create trip
    trip = await Trip.create({
      vendor: vendor._id,
      title: 'Test Trip',
      category: 'adventure',
      price: 299,
      duration: { days: 3, nights: 2 }
    });
  });

  afterAll(async () => {
    await User.deleteMany({});
    await Trip.deleteMany({});
    await Booking.deleteMany({});
  });

  it('should complete full booking flow', async () => {
    // 1. Create booking
    const bookingRes = await request(app)
      .post('/api/v1/bookings')
      .set('Authorization', `Bearer ${customerToken}`)
      .send({
        trip: trip._id,
        startDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        participants: 2
      })
      .expect(201);

    const bookingId = bookingRes.body.data.booking._id;

    // 2. Confirm payment
    const paymentRes = await request(app)
      .post(`/api/v1/bookings/${bookingId}/payment`)
      .set('Authorization', `Bearer ${customerToken}`)
      .send({
        paymentMethod: 'stripe',
        paymentIntentId: 'pi_test_123'
      })
      .expect(200);

    expect(paymentRes.body.data.booking.paymentStatus).toBe('paid');

    // 3. Get booking details
    const detailsRes = await request(app)
      .get(`/api/v1/bookings/${bookingId}`)
      .set('Authorization', `Bearer ${customerToken}`)
      .expect(200);

    expect(detailsRes.body.data.booking).toHaveProperty('bookingId');
  });
});
```

### Run Backend Tests

```bash
# All tests
npm test

# Watch mode
npm test -- --watch

# Coverage
npm test -- --coverage

# Specific file
npm test -- authController.test.js
```

---

## ⚛️ Frontend Testing

### Component Tests

```typescript
// __tests__/components/SearchBar.test.tsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SearchBar from '@/components/ui/SearchBar';

describe('SearchBar Component', () => {
  it('renders search input', () => {
    render(<SearchBar />);
    
    const input = screen.getByPlaceholderText(/search/i);
    expect(input).toBeInTheDocument();
  });

  it('shows suggestions on typing', async () => {
    render(<SearchBar />);
    
    const input = screen.getByRole('textbox');
    await userEvent.type(input, 'mountain');

    await waitFor(() => {
      expect(screen.getByText(/mountain trek/i)).toBeInTheDocument();
    });
  });

  it('calls onSearch with query', async () => {
    const mockOnSearch = jest.fn();
    render(<SearchBar onSearch={mockOnSearch} />);
    
    const input = screen.getByRole('textbox');
    await userEvent.type(input, 'beach{enter}');

    expect(mockOnSearch).toHaveBeenCalledWith('beach');
  });
});
```

### Hook Tests

```typescript
// __tests__/hooks/useAuth.test.ts
import { renderHook, act } from '@testing-library/react';
import { useAuth } from '@/hooks/useAuth';

describe('useAuth Hook', () => {
  it('initializes with no user', () => {
    const { result } = renderHook(() => useAuth());
    
    expect(result.current.user).toBeNull();
    expect(result.current.isAuthenticated).toBe(false);
  });

  it('logs in user', async () => {
    const { result } = renderHook(() => useAuth());
    
    await act(async () => {
      await result.current.login('test@example.com', 'password');
    });

    expect(result.current.isAuthenticated).toBe(true);
    expect(result.current.user).toHaveProperty('email');
  });

  it('logs out user', async () => {
    const { result } = renderHook(() => useAuth());
    
    await act(async () => {
      await result.current.logout();
    });

    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.user).toBeNull();
  });
});
```

### API Tests

```typescript
// __tests__/lib/api/trips.test.ts
import { getTrips, getTripBySlug } from '@/lib/api/trips';
import axios from '@/lib/api/axios';

jest.mock('@/lib/api/axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('Trips API', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getTrips', () => {
    it('fetches trips successfully', async () => {
      const mockTrips = [
        { _id: '1', title: 'Trip 1' },
        { _id: '2', title: 'Trip 2' }
      ];

      mockedAxios.get.mockResolvedValue({
        data: { data: { trips: mockTrips } }
      });

      const result = await getTrips();

      expect(result).toEqual(mockTrips);
      expect(mockedAxios.get).toHaveBeenCalledWith('/trips');
    });

    it('handles errors', async () => {
      mockedAxios.get.mockRejectedValue(new Error('Network error'));

      await expect(getTrips()).rejects.toThrow('Network error');
    });
  });
});
```

### Run Frontend Tests

```bash
# All tests
npm test

# Watch mode
npm test -- --watch

# UI mode (Vitest)
npm run test:ui

# Coverage
npm test -- --coverage
```

---

## 🔗 Integration Testing

### API Integration Tests

```bash
# Run integration tests
npm run test:integration

# With Docker
docker-compose -f docker-compose.test.yml up --abort-on-container-exit
```

---

## 🎭 E2E Testing with Playwright

### Setup

```bash
npm install --save-dev @playwright/test
npx playwright install
```

### E2E Tests

```typescript
// e2e/booking-flow.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Booking Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Login
    await page.goto('/login');
    await page.fill('[name="email"]', 'customer@example.com');
    await page.fill('[name="password"]', 'Password123!');
    await page.click('button[type="submit"]');
    await page.waitForURL('/');
  });

  test('should complete booking', async ({ page }) => {
    // Search for trip
    await page.goto('/trips');
    await page.fill('[placeholder="Search trips"]', 'mountain');
    await page.click('text=Mountain Adventure Trek');

    // Book trip
    await page.click('text=Book Now');
    await page.fill('[name="participants"]', '2');
    await page.fill('[name="startDate"]', '2024-12-25');
    await page.click('button:has-text("Continue to Payment")');

    // Complete payment
    await page.fill('[name="cardNumber"]', '4242424242424242');
    await page.fill('[name="expiry"]', '12/25');
    await page.fill('[name="cvc"]', '123');
    await page.click('button:has-text("Pay Now")');

    // Verify confirmation
    await expect(page.locator('text=Booking Confirmed')).toBeVisible();
  });
});
```

### Run E2E Tests

```bash
# All tests
npx playwright test

# Headed mode
npx playwright test --headed

# Debug mode
npx playwright test --debug

# Specific browser
npx playwright test --project=chromium
```

---

## 🔥 Load Testing

### Using test-load.js

```bash
cd backend
npm run load-test
```

### Using Artillery

```bash
npm install -g artillery

# Quick test
artillery quick --count 10 --num 100 http://localhost:5000/api/v1/trips

# Custom test
artillery run load-test.yml
```

### load-test.yml

```yaml
config:
  target: "http://localhost:5000"
  phases:
    - duration: 60
      arrivalRate: 10
      name: "Warm up"
    - duration: 120
      arrivalRate: 50
      name: "Sustained load"
    - duration: 60
      arrivalRate: 100
      name: "Peak load"
  
scenarios:
  - name: "Browse trips"
    flow:
      - get:
          url: "/api/v1/trips"
      - think: 2
      - get:
          url: "/api/v1/trips/{{ $randomString() }}"
  
  - name: "Search"
    weight: 3
    flow:
      - get:
          url: "/api/v1/search?query=mountain"
```

---

## 🔒 Security Testing

### OWASP ZAP

```bash
docker run -t owasp/zap2docker-stable zap-baseline.py \
  -t http://localhost:5000
```

### npm audit

```bash
npm audit
npm audit fix
```

### Snyk

```bash
npm install -g snyk
snyk test
snyk monitor
```

---

## 📊 Test Coverage Goals

- **Unit Tests**: > 80%
- **Integration Tests**: > 70%
- **E2E Tests**: Critical paths
- **Overall**: > 75%

---

## ✅ Testing Checklist

### Before Deployment

- [ ] All unit tests passing
- [ ] Integration tests passing
- [ ] E2E tests for critical paths passing
- [ ] Load tests showing acceptable performance
- [ ] Security scan passed
- [ ] No high-severity vulnerabilities
- [ ] Test coverage meets goals

---

## 🚀 Quick Start

```bash
# 1. Setup test environment
npm run test:setup

# 2. Run all tests
npm run test:all

# 3. Check coverage
npm run test:coverage

# 4. Run health check
./scripts/health-check.sh
```

---

**Happy Testing! 🧪**

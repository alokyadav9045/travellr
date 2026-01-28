const TestHelper = require('./helpers');
const ApiError = require('../src/utils/ApiError');

describe('Auth Controller Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should register user with valid data', async () => {
    const authController = require('../src/controllers/authController');
    
    const req = {
      body: {
        name: 'Test User',
        email: 'test@example.com',
        password: 'SecurePass123',
        role: 'customer'
      }
    };
    
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    
    // Mock database operations
    jest.spyOn(require('../src/models/User'), 'findOne').mockResolvedValueOnce(null);
    jest.spyOn(require('../src/models/User'), 'create').mockResolvedValueOnce({
      _id: 'userid',
      name: 'Test User',
      email: 'test@example.com'
    });
    
    await authController.register(req, res);
    
    expect(res.status).toHaveBeenCalledWith(201);
  });

  test('should reject duplicate email on register', async () => {
    const authController = require('../src/controllers/authController');
    const User = require('../src/models/User');
    
    const req = {
      body: {
        name: 'Test User',
        email: 'existing@example.com',
        password: 'Password123'
      }
    };
    
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    
    jest.spyOn(User, 'findOne').mockResolvedValueOnce({ email: 'existing@example.com' });
    
    await authController.register(req, res);
    
    expect(res.status).toHaveBeenCalledWith(400);
  });

  test('should login with valid credentials', async () => {
    const authController = require('../src/controllers/authController');
    const User = require('../src/models/User');
    
    const req = {
      body: {
        email: 'test@example.com',
        password: 'CorrectPassword123'
      }
    };
    
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    
    const mockUser = {
      _id: 'userid',
      email: 'test@example.com',
      matchPassword: jest.fn().mockResolvedValue(true),
      generateAuthToken: jest.fn().mockReturnValue('token123')
    };
    
    jest.spyOn(User, 'findOne').mockResolvedValueOnce(mockUser);
    
    await authController.login(req, res);
    
    expect(mockUser.matchPassword).toHaveBeenCalledWith('CorrectPassword123');
  });

  test('should reject login with invalid password', async () => {
    const authController = require('../src/controllers/authController');
    const User = require('../src/models/User');
    
    const req = {
      body: {
        email: 'test@example.com',
        password: 'WrongPassword123'
      }
    };
    
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    
    const mockUser = {
      _id: 'userid',
      matchPassword: jest.fn().mockResolvedValue(false)
    };
    
    jest.spyOn(User, 'findOne').mockResolvedValueOnce(mockUser);
    
    await authController.login(req, res);
    
    expect(res.status).toHaveBeenCalledWith(401);
  });
});

describe('PromoCode Controller Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should validate promo code successfully', async () => {
    const promoController = require('../src/controllers/promoCodeController');
    const PromoCode = require('../src/models/PromoCode');
    
    const req = {
      body: {
        code: 'SUMMER20',
        amount: 50000
      }
    };
    
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    
    const mockPromo = {
      _id: 'promoid',
      code: 'SUMMER20',
      discountType: 'percentage',
      discountValue: 20,
      isValid: jest.fn().mockReturnValue(true),
      calculateDiscount: jest.fn().mockReturnValue(10000)
    };
    
    jest.spyOn(PromoCode, 'findOne').mockResolvedValueOnce(mockPromo);
    
    await promoController.validate(req, res);
    
    expect(res.status).toHaveBeenCalledWith(200);
  });

  test('should reject invalid promo code', async () => {
    const promoController = require('../src/controllers/promoCodeController');
    const PromoCode = require('../src/models/PromoCode');
    
    const req = {
      body: {
        code: 'INVALID123'
      }
    };
    
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    
    jest.spyOn(PromoCode, 'findOne').mockResolvedValueOnce(null);
    
    await promoController.validate(req, res);
    
    expect(res.status).toHaveBeenCalledWith(404);
  });

  test('should create promo code with valid data', async () => {
    const promoController = require('../src/controllers/promoCodeController');
    const PromoCode = require('../src/models/PromoCode');
    
    const req = {
      body: {
        code: 'NEWPROMO',
        discountType: 'percentage',
        discountValue: 15,
        validFrom: new Date(),
        validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
      },
      user: { id: 'adminid', role: 'admin' }
    };
    
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    
    jest.spyOn(PromoCode, 'create').mockResolvedValueOnce({
      ...req.body,
      _id: 'promoid'
    });
    
    await promoController.create(req, res);
    
    expect(res.status).toHaveBeenCalledWith(201);
  });

  test('should list promo codes with pagination', async () => {
    const promoController = require('../src/controllers/promoCodeController');
    const PromoCode = require('../src/models/PromoCode');
    
    const req = {
      query: { page: 1, limit: 20 },
      user: { id: 'adminid', role: 'admin' }
    };
    
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    
    jest.spyOn(PromoCode, 'countDocuments').mockResolvedValueOnce(50);
    jest.spyOn(PromoCode, 'find').mockReturnValue({
      skip: jest.fn().mockReturnThis(),
      limit: jest.fn().mockResolvedValueOnce([
        { code: 'PROMO1', active: true },
        { code: 'PROMO2', active: true }
      ])
    });
    
    await promoController.list(req, res);
    
    expect(res.status).toHaveBeenCalledWith(200);
  });
});

describe('Booking Controller Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should create booking successfully', async () => {
    const bookingController = require('../src/controllers/bookingController');
    const Booking = require('../src/models/Booking');
    const Trip = require('../src/models/Trip');
    
    const req = {
      body: {
        trip: 'tripid',
        numberOfGuests: 2,
        selectedDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
      },
      user: { id: 'userid' }
    };
    
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    
    jest.spyOn(Trip, 'findById').mockResolvedValueOnce({
      _id: 'tripid',
      price: 50000,
      vendor: 'vendorid'
    });
    
    jest.spyOn(Booking, 'create').mockResolvedValueOnce({
      _id: 'bookingid',
      trip: 'tripid',
      customer: 'userid'
    });
    
    await bookingController.create(req, res);
    
    expect(res.status).toHaveBeenCalledWith(201);
  });

  test('should apply promo code to booking', async () => {
    const bookingController = require('../src/controllers/bookingController');
    const Booking = require('../src/models/Booking');
    const PromoCode = require('../src/models/PromoCode');
    
    const req = {
      body: {
        trip: 'tripid',
        promoCode: 'SUMMER20',
        numberOfGuests: 2,
        selectedDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
      },
      user: { id: 'userid' }
    };
    
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    
    const mockPromo = {
      _id: 'promoid',
      code: 'SUMMER20',
      isValid: jest.fn().mockReturnValue(true),
      calculateDiscount: jest.fn().mockReturnValue(10000),
      recordUsage: jest.fn()
    };
    
    jest.spyOn(PromoCode, 'findOne').mockResolvedValueOnce(mockPromo);
    
    await bookingController.create(req, res);
    
    expect(res.status).toHaveBeenCalledWith(201);
  });
});

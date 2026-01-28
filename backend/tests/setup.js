// Backend test setup
const mongoose = require('mongoose');

// Mock environment variables
process.env.MONGO_URI = 'mongodb://localhost:27017/travellr-test';
process.env.JWT_SECRET = 'test-secret-key';
process.env.STRIPE_SECRET_KEY = 'sk_test_mock';
process.env.CLOUDINARY_CLOUD_NAME = 'test-cloud';
process.env.NODE_ENV = 'test';
process.env.REDIS_URL = 'redis://localhost:6379/1';

// Global test timeout
jest.setTimeout(30000);

// Clean up database after tests
afterAll(async () => {
  if (mongoose.connection.readyState === 1) {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
  }
});

// Suppress console logs during tests
global.console = {
  ...console,
  log: jest.fn(),
  debug: jest.fn(),
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn()
};

module.exports = {};

const mongoose = require('mongoose');
const env = require('./env');
const logger = require('../utils/logger');
const dns = require('dns');

// Use Google DNS to avoid connection issues with some ISP resolvers when using mongodb+srv
if (process.env.NODE_ENV !== 'test') {
  try {
    dns.setServers(['8.8.8.8', '8.8.4.4']);
  } catch (err) {
    logger.warn('Failed to set custom DNS servers', { error: err.message });
  }
}

const connectDB = async () => {
  try {
    if (!env.mongodb.uri) {
      logger.warn('MongoDB URI not configured. Server will run without database.');
      return null;
    }

    const options = {
      maxPoolSize: 10,
      minPoolSize: 5,
      serverSelectionTimeoutMS: 30000, // Increased to 30s
      socketTimeoutMS: 60000, // Increased to 60s
      family: 4 // Force IPv4 to avoid some ENOTFOUND issues
    };

    const conn = await mongoose.connect(env.mongodb.uri, options);

    logger.info(`MongoDB Connected: ${conn.connection.host}`, {
      database: conn.connection.name,
    });

    mongoose.connection.on('error', (err) => {
      logger.error('MongoDB connection error:', err);
    });

    mongoose.connection.on('disconnected', () => {
      logger.warn('MongoDB disconnected. Attempting to reconnect...');
    });

    mongoose.connection.on('reconnected', () => {
      logger.info('MongoDB reconnected');
    });

    const gracefulShutdown = async (signal) => {
      logger.info(`${signal} received. Closing MongoDB connection...`);
      await mongoose.connection.close();
      logger.info('MongoDB connection closed');
      process.exit(0);
    };

    process.on('SIGINT', () => gracefulShutdown('SIGINT'));
    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));

    return conn;
  } catch (error) {
    logger.error('Error connecting to MongoDB:', {
      message: error.message,
      code: error.code,
    });
    logger.warn('Server will continue without database. MongoDB may not be running.');
    return null;
  }
};

const disconnectDB = async () => {
  try {
    await mongoose.connection.close();
    logger.info('MongoDB disconnected');
  } catch (error) {
    logger.error('Error disconnecting from MongoDB:', error);
  }
};

module.exports = { connectDB, disconnectDB };
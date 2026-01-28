const Redis = require('ioredis');
const env = require('./env');
const logger = require('../utils/logger');

let redis = null;

const connectRedis = () => {
  if (redis) return redis;

  try {
    redis = new Redis({
      host: env.redis.host,
      port: env.redis.port,
      password: env.redis.password || undefined,
      db: env.redis.db,
      maxRetriesPerRequest: 3,
      retryStrategy: (times) => {
        if (times > 3) {
          logger.error('Redis connection failed after 3 retries');
          return null;
        }
        return Math.min(times * 200, 2000);
      },
      enableReadyCheck: true,
      lazyConnect: true,
    });

    redis.on('connect', () => {
      logger.info('Redis connected');
    });

    redis.on('ready', () => {
      logger.info('Redis ready');
    });

    redis.on('error', (err) => {
      logger.error('Redis error:', err.message);
    });

    redis.on('close', () => {
      logger.warn('Redis connection closed');
    });

    redis.on('reconnecting', () => {
      logger.info('Redis reconnecting...');
    });

    return redis;
  } catch (error) {
    logger.error('Redis initialization failed:', error.message);
    return null;
  }
};

const getRedis = () => redis;

module.exports = {
  connectRedis,
  getRedis,
};
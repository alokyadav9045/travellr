// Advanced caching middleware with smart invalidation
const redis = require('redis');
const { promisify } = require('util');

const redisClient = redis.createClient(process.env.REDIS_URL);
redisClient.on('error', (err) => console.log('Redis error:', err));

const getAsync = promisify(redisClient.get).bind(redisClient);
const setAsync = promisify(redisClient.set).bind(redisClient);
const delAsync = promisify(redisClient.del).bind(redisClient);
const scanAsync = promisify(redisClient.scan).bind(redisClient);

class CacheManager {
  constructor() {
    this.ttl = {
      trips: 60 * 30, // 30 minutes
      bookings: 60 * 15, // 15 minutes
      users: 60 * 60, // 1 hour
      promos: 60 * 60, // 1 hour
      analytics: 60 * 5 // 5 minutes
    };
  }

  /**
   * Generate cache key
   */
  generateKey(resource, params = {}) {
    const sortedParams = Object.keys(params)
      .sort()
      .map(key => `${key}:${params[key]}`)
      .join('|');
    return `${resource}${sortedParams ? ':' + sortedParams : ''}`;
  }

  /**
   * Get cached data
   */
  async get(resource, params = {}) {
    try {
      const key = this.generateKey(resource, params);
      const data = await getAsync(key);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Cache get error:', error);
      return null;
    }
  }

  /**
   * Set cache with TTL
   */
  async set(resource, params = {}, data) {
    try {
      const key = this.generateKey(resource, params);
      const ttl = this.ttl[resource] || 60 * 10; // Default 10 minutes
      await setAsync(key, JSON.stringify(data), 'EX', ttl);
    } catch (error) {
      console.error('Cache set error:', error);
    }
  }

  /**
   * Delete specific cache entry
   */
  async delete(resource, params = {}) {
    try {
      const key = this.generateKey(resource, params);
      await delAsync(key);
    } catch (error) {
      console.error('Cache delete error:', error);
    }
  }

  /**
   * Delete all cache entries matching pattern
   */
  async deletePattern(pattern) {
    try {
      let cursor = 0;
      const batch = [];

      do {
        const [newCursor, keys] = await scanAsync(cursor, 'MATCH', pattern);
        cursor = parseInt(newCursor);

        if (keys.length > 0) {
          batch.push(...keys);
        }
      } while (cursor !== 0);

      if (batch.length > 0) {
        await Promise.all(batch.map(key => delAsync(key)));
      }
    } catch (error) {
      console.error('Cache delete pattern error:', error);
    }
  }

  /**
   * Clear all cache
   */
  async clear() {
    try {
      await redisClient.flushdb();
    } catch (error) {
      console.error('Cache clear error:', error);
    }
  }

  /**
   * Smart invalidation - invalidate related caches
   */
  async invalidateRelated(resource) {
    const patterns = {
      trips: ['trips:*', 'analytics:trips:*'],
      bookings: ['bookings:*', 'users:*:bookings', 'analytics:bookings:*'],
      users: ['users:*', 'analytics:users:*'],
      promos: ['promo-codes:*', 'bookings:*'], // Invalidate bookings when promo changes
      vendors: ['vendors:*', 'trips:*', 'analytics:vendors:*'],
      reviews: ['reviews:*', 'trips:*', 'users:*:reviews', 'analytics:reviews:*']
    };

    const patternsToInvalidate = patterns[resource] || [];
    for (const pattern of patternsToInvalidate) {
      await this.deletePattern(pattern);
    }
  }
}

// Middleware for response caching
function cacheMiddleware(resource, params = 'query') {
  return async (req, res, next) => {
    // Skip cache for non-GET requests
    if (req.method !== 'GET') {
      return next();
    }

    const cacheManager = new CacheManager();
    
    // Generate cache parameters
    const cacheParams = params === 'query' ? req.query : req.params;
    
    // Try to get from cache
    const cached = await cacheManager.get(resource, cacheParams);
    if (cached) {
      return res.status(200).json({
        success: true,
        data: cached,
        fromCache: true
      });
    }

    // Store original json function
    const originalJson = res.json.bind(res);

    // Override json to cache response
    res.json = function(body) {
      if (res.statusCode === 200 && body.success && body.data) {
        cacheManager.set(resource, cacheParams, body.data);
      }
      return originalJson(body);
    };

    next();
  };
}

// Middleware for cache invalidation
function invalidateCache(resource) {
  return async (req, res, next) => {
    // Store original json
    const originalJson = res.json.bind(res);

    // Override json to invalidate on success
    res.json = async function(body) {
      if (res.statusCode >= 200 && res.statusCode < 300 && body.success) {
        const cacheManager = new CacheManager();
        await cacheManager.invalidateRelated(resource);
      }
      return originalJson(body);
    };

    next();
  };
}

module.exports = {
  CacheManager,
  cacheMiddleware,
  invalidateCache
};

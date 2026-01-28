/**
 * Redis Cache Management Script
 * Utilities for cache warming, clearing, and monitoring
 */

const Redis = require('ioredis');
const mongoose = require('mongoose');
require('dotenv').config();

const redis = new Redis(process.env.REDIS_URL);

/**
 * Cache statistics
 */
async function getCacheStats() {
  console.log('📊 Cache Statistics\n');

  try {
    // Get Redis info
    const info = await redis.info('stats');
    const lines = info.split('\r\n');
    
    const stats = {};
    lines.forEach(line => {
      const [key, value] = line.split(':');
      if (key && value) {
        stats[key] = value;
      }
    });

    console.log('Memory Usage:');
    const memory = await redis.info('memory');
    const memoryLines = memory.split('\r\n');
    memoryLines.forEach(line => {
      if (line.includes('used_memory_human') || line.includes('used_memory_peak_human')) {
        console.log(`  ${line}`);
      }
    });

    console.log('\nKey Statistics:');
    const dbsize = await redis.dbsize();
    console.log(`  Total Keys: ${dbsize}`);
    console.log(`  Total Connections: ${stats.total_connections_received || 'N/A'}`);
    console.log(`  Total Commands: ${stats.total_commands_processed || 'N/A'}`);

    // Get key patterns
    console.log('\nKey Patterns:');
    const patterns = ['trip:*', 'search:*', 'user:*', 'booking:*'];
    
    for (const pattern of patterns) {
      const keys = await redis.keys(pattern);
      console.log(`  ${pattern}: ${keys.length} keys`);
    }

    // Hit rate
    const keyspaceHits = parseInt(stats.keyspace_hits || 0);
    const keyspaceMisses = parseInt(stats.keyspace_misses || 0);
    const hitRate = keyspaceHits + keyspaceMisses > 0
      ? ((keyspaceHits / (keyspaceHits + keyspaceMisses)) * 100).toFixed(2)
      : 0;

    console.log('\nCache Hit Rate:');
    console.log(`  Hits: ${keyspaceHits}`);
    console.log(`  Misses: ${keyspaceMisses}`);
    console.log(`  Hit Rate: ${hitRate}%`);

  } catch (error) {
    console.error('❌ Error getting stats:', error.message);
  }
}

/**
 * Clear all cache
 */
async function clearAllCache() {
  console.log('🗑️ Clearing all cache...');

  try {
    await redis.flushdb();
    console.log('✅ Cache cleared successfully!');
  } catch (error) {
    console.error('❌ Error clearing cache:', error.message);
  }
}

/**
 * Clear cache by pattern
 */
async function clearCacheByPattern(pattern) {
  console.log(`🗑️ Clearing cache for pattern: ${pattern}`);

  try {
    const keys = await redis.keys(pattern);
    
    if (keys.length === 0) {
      console.log('No keys found for pattern');
      return;
    }

    console.log(`Found ${keys.length} keys`);
    
    // Delete in batches
    const batchSize = 100;
    for (let i = 0; i < keys.length; i += batchSize) {
      const batch = keys.slice(i, i + batchSize);
      await redis.del(...batch);
    }

    console.log(`✅ Deleted ${keys.length} keys`);
  } catch (error) {
    console.error('❌ Error clearing cache:', error.message);
  }
}

/**
 * Warm trip cache
 */
async function warmTripCache() {
  console.log('🔥 Warming trip cache...');

  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);

    const Trip = require('../models/Trip');

    // Cache featured trips
    console.log('Caching featured trips...');
    const featuredTrips = await Trip.find({ featured: true, status: 'active' })
      .populate('vendor', 'businessName')
      .limit(20)
      .lean();

    await redis.setex(
      'trips:featured',
      3600, // 1 hour
      JSON.stringify(featuredTrips)
    );
    console.log(`✅ Cached ${featuredTrips.length} featured trips`);

    // Cache popular trips
    console.log('Caching popular trips...');
    const popularTrips = await Trip.find({ status: 'active' })
      .sort({ bookingCount: -1 })
      .populate('vendor', 'businessName')
      .limit(20)
      .lean();

    await redis.setex(
      'trips:popular',
      3600,
      JSON.stringify(popularTrips)
    );
    console.log(`✅ Cached ${popularTrips.length} popular trips`);

    // Cache trips by category
    const categories = ['adventure', 'beach', 'cultural', 'mountain', 'wildlife'];
    
    for (const category of categories) {
      console.log(`Caching ${category} trips...`);
      const trips = await Trip.find({ category, status: 'active' })
        .populate('vendor', 'businessName')
        .limit(10)
        .lean();

      await redis.setex(
        `trips:category:${category}`,
        3600,
        JSON.stringify(trips)
      );
      console.log(`✅ Cached ${trips.length} ${category} trips`);
    }

    await mongoose.disconnect();
    console.log('🎉 Trip cache warmed successfully!');

  } catch (error) {
    console.error('❌ Error warming cache:', error.message);
    await mongoose.disconnect();
  }
}

/**
 * Warm search cache
 */
async function warmSearchCache() {
  console.log('🔥 Warming search cache...');

  try {
    await mongoose.connect(process.env.MONGO_URI);
    const Trip = require('../models/Trip');

    // Popular search queries
    const popularQueries = [
      'mountain',
      'beach',
      'adventure',
      'cultural',
      'trekking',
      'safari',
      'diving',
      'camping'
    ];

    for (const query of popularQueries) {
      console.log(`Caching search: "${query}"`);
      
      const results = await Trip.find({
        $text: { $search: query },
        status: 'active'
      })
        .populate('vendor', 'businessName')
        .limit(20)
        .lean();

      await redis.setex(
        `search:${query}`,
        1800, // 30 minutes
        JSON.stringify(results)
      );
    }

    await mongoose.disconnect();
    console.log('✅ Search cache warmed successfully!');

  } catch (error) {
    console.error('❌ Error warming search cache:', error.message);
    await mongoose.disconnect();
  }
}

/**
 * List all cache keys
 */
async function listCacheKeys(pattern = '*', limit = 100) {
  console.log(`📋 Cache Keys (${pattern}):\n`);

  try {
    const keys = await redis.keys(pattern);
    
    if (keys.length === 0) {
      console.log('No keys found');
      return;
    }

    console.log(`Total keys: ${keys.length}`);
    console.log(`Showing first ${Math.min(limit, keys.length)}:\n`);

    for (let i = 0; i < Math.min(limit, keys.length); i++) {
      const key = keys[i];
      const ttl = await redis.ttl(key);
      const type = await redis.type(key);
      
      console.log(`${i + 1}. ${key}`);
      console.log(`   Type: ${type}, TTL: ${ttl > 0 ? `${ttl}s` : 'No expiry'}`);
    }

  } catch (error) {
    console.error('❌ Error listing keys:', error.message);
  }
}

/**
 * Main execution
 */
async function main() {
  const args = process.argv.slice(2);
  const command = args[0];

  try {
    switch (command) {
      case 'stats':
        await getCacheStats();
        break;

      case 'clear':
        const pattern = args[1];
        if (pattern) {
          await clearCacheByPattern(pattern);
        } else {
          await clearAllCache();
        }
        break;

      case 'warm':
        const type = args[1];
        if (type === 'trips') {
          await warmTripCache();
        } else if (type === 'search') {
          await warmSearchCache();
        } else {
          await warmTripCache();
          await warmSearchCache();
        }
        break;

      case 'list':
        const listPattern = args[1] || '*';
        const listLimit = parseInt(args[2]) || 100;
        await listCacheKeys(listPattern, listLimit);
        break;

      default:
        console.log(`
Redis Cache Manager
===================

Usage:
  npm run cache:stats          - Show cache statistics
  npm run cache:clear [pattern] - Clear cache (all or by pattern)
  npm run cache:warm [type]    - Warm cache (trips, search, or all)
  npm run cache:list [pattern] - List cache keys

Examples:
  npm run cache:stats
  npm run cache:clear
  npm run cache:clear "trip:*"
  npm run cache:warm trips
  npm run cache:list "search:*"
        `);
    }

    await redis.quit();
    process.exit(0);

  } catch (error) {
    console.error('❌ Error:', error.message);
    await redis.quit();
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  main();
}

module.exports = {
  getCacheStats,
  clearAllCache,
  clearCacheByPattern,
  warmTripCache,
  warmSearchCache,
  listCacheKeys
};

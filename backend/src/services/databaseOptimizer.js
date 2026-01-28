// Database performance optimization service
const mongoose = require('mongoose');

class DatabaseOptimizer {
  /**
   * Create compound indexes for common queries
   */
  static async createOptimalIndexes() {
    try {
      console.log('Creating database indexes...');

      // User indexes
      const User = mongoose.model('User');
      await User.collection.createIndex({ email: 1 }, { unique: true });
      await User.collection.createIndex({ role: 1 });
      await User.collection.createIndex({ createdAt: -1 });

      // Trip indexes
      const Trip = mongoose.model('Trip');
      await Trip.collection.createIndex({ vendor: 1, status: 1 });
      await Trip.collection.createIndex({ 'location.country': 1, 'location.state': 1 });
      await Trip.collection.createIndex({ price: 1, rating: -1 });
      await Trip.collection.createIndex({ createdAt: -1 });
      await Trip.collection.createIndex({ slug: 1 }, { unique: true });

      // Booking indexes
      const Booking = mongoose.model('Booking');
      await Booking.collection.createIndex({ customer: 1, status: 1 });
      await Booking.collection.createIndex({ trip: 1 });
      await Booking.collection.createIndex({ vendor: 1, createdAt: -1 });
      await Booking.collection.createIndex({ bookingNumber: 1 }, { unique: true });
      await Booking.collection.createIndex({ 'payment.paymentStatus': 1 });
      await Booking.collection.createIndex({ createdAt: -1 });

      // PromoCode indexes
      const PromoCode = mongoose.model('PromoCode');
      await PromoCode.collection.createIndex({ code: 1 }, { unique: true });
      await PromoCode.collection.createIndex({ active: 1, validUntil: 1 });
      await PromoCode.collection.createIndex({ usedCount: 1 });
      await PromoCode.collection.createIndex({ validFrom: 1, validUntil: -1 });

      // Payment indexes
      const Payment = mongoose.model('Payment');
      await Payment.collection.createIndex({ booking: 1 });
      await Payment.collection.createIndex({ user: 1, status: 1 });
      await Payment.collection.createIndex({ paymentIntentId: 1 });
      await Payment.collection.createIndex({ createdAt: -1 });

      // Review indexes
      const Review = mongoose.model('Review');
      await Review.collection.createIndex({ trip: 1, rating: -1 });
      await Review.collection.createIndex({ user: 1 });
      await Review.collection.createIndex({ createdAt: -1 });

      // Notification indexes
      const Notification = mongoose.model('Notification');
      await Notification.collection.createIndex({ user: 1, read: 1 });
      await Notification.collection.createIndex({ createdAt: -1 });
      await Notification.collection.createIndex({ type: 1 });

      console.log('✅ All indexes created successfully');
    } catch (error) {
      console.error('Error creating indexes:', error);
    }
  }

  /**
   * Optimize query with lean and select
   */
  static optimizeQuery(query, fields = null) {
    // Use lean for read-only queries (returns plain objects, faster)
    query = query.lean();

    // Select specific fields to reduce data transfer
    if (fields) {
      query = query.select(fields);
    }

    return query;
  }

  /**
   * Implement pagination cursor for large datasets
   */
  static async cursorPaginate(model, query = {}, cursor = null, limit = 20) {
    try {
      let mongoQuery = model.find(query);

      if (cursor) {
        mongoQuery = mongoQuery.find({ _id: { $gt: cursor } });
      }

      const items = await mongoQuery
        .limit(limit + 1)
        .lean()
        .exec();

      const hasMore = items.length > limit;
      const data = hasMore ? items.slice(0, limit) : items;
      const nextCursor = hasMore ? data[data.length - 1]._id : null;

      return {
        data,
        nextCursor,
        hasMore
      };
    } catch (error) {
      console.error('Cursor pagination error:', error);
      throw error;
    }
  }

  /**
   * Batch database operations
   */
  static async batchInsert(model, documents, batchSize = 1000) {
    try {
      const results = [];
      for (let i = 0; i < documents.length; i += batchSize) {
        const batch = documents.slice(i, i + batchSize);
        const inserted = await model.insertMany(batch);
        results.push(...inserted);
      }
      return results;
    } catch (error) {
      console.error('Batch insert error:', error);
      throw error;
    }
  }

  /**
   * Batch update operations
   */
  static async batchUpdate(model, updates) {
    try {
      const operations = updates.map(({ filter, update }) => ({
        updateOne: {
          filter,
          update: { $set: update }
        }
      }));

      const result = await model.bulkWrite(operations);
      return result;
    } catch (error) {
      console.error('Batch update error:', error);
      throw error;
    }
  }

  /**
   * Aggregation pipeline for complex queries
   */
  static async aggregateWithOptimization(model, pipeline) {
    try {
      // Add $match early to reduce data
      const optimizedPipeline = [
        {
          $match: pipeline[0]?.$match || {}
        },
        ...pipeline.slice(1)
      ];

      return await model.aggregate(optimizedPipeline).exec();
    } catch (error) {
      console.error('Aggregation error:', error);
      throw error;
    }
  }
}

module.exports = DatabaseOptimizer;

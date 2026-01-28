/**
 * Database Index Management Script
 * Create and optimize MongoDB indexes for performance
 */

const mongoose = require('mongoose');
require('dotenv').config();

/**
 * Create all required indexes
 */
async function createIndexes() {
  console.log('🔨 Creating database indexes...\n');

  try {
    await mongoose.connect(process.env.MONGO_URI);

    // User indexes
    console.log('Creating User indexes...');
    const User = require('../models/User');
    await User.collection.createIndex({ email: 1 }, { unique: true });
    await User.collection.createIndex({ role: 1 });
    await User.collection.createIndex({ createdAt: -1 });
    await User.collection.createIndex({ 'profile.phone': 1 });
    console.log('✅ User indexes created');

    // Trip indexes
    console.log('\nCreating Trip indexes...');
    const Trip = require('../models/Trip');
    await Trip.collection.createIndex({ vendor: 1 });
    await Trip.collection.createIndex({ category: 1 });
    await Trip.collection.createIndex({ status: 1 });
    await Trip.collection.createIndex({ featured: 1 });
    await Trip.collection.createIndex({ price: 1 });
    await Trip.collection.createIndex({ rating: -1 });
    await Trip.collection.createIndex({ bookingCount: -1 });
    await Trip.collection.createIndex({ slug: 1 }, { unique: true });
    await Trip.collection.createIndex({ createdAt: -1 });
    
    // Text search index
    await Trip.collection.createIndex({
      title: 'text',
      description: 'text',
      'highlights.text': 'text'
    });
    
    // Geospatial index
    await Trip.collection.createIndex({ 'location.coordinates': '2dsphere' });
    
    // Compound indexes
    await Trip.collection.createIndex({ category: 1, status: 1, rating: -1 });
    await Trip.collection.createIndex({ vendor: 1, status: 1 });
    await Trip.collection.createIndex({ featured: 1, status: 1, rating: -1 });
    console.log('✅ Trip indexes created');

    // Booking indexes
    console.log('\nCreating Booking indexes...');
    const Booking = require('../models/Booking');
    await Booking.collection.createIndex({ user: 1 });
    await Booking.collection.createIndex({ trip: 1 });
    await Booking.collection.createIndex({ vendor: 1 });
    await Booking.collection.createIndex({ bookingId: 1 }, { unique: true });
    await Booking.collection.createIndex({ status: 1 });
    await Booking.collection.createIndex({ paymentStatus: 1 });
    await Booking.collection.createIndex({ startDate: 1 });
    await Booking.collection.createIndex({ createdAt: -1 });
    
    // Compound indexes
    await Booking.collection.createIndex({ user: 1, status: 1 });
    await Booking.collection.createIndex({ vendor: 1, status: 1 });
    await Booking.collection.createIndex({ trip: 1, startDate: 1 });
    console.log('✅ Booking indexes created');

    // Review indexes
    console.log('\nCreating Review indexes...');
    const Review = require('../models/Review');
    await Review.collection.createIndex({ trip: 1 });
    await Review.collection.createIndex({ user: 1 });
    await Review.collection.createIndex({ vendor: 1 });
    await Review.collection.createIndex({ rating: -1 });
    await Review.collection.createIndex({ createdAt: -1 });
    await Review.collection.createIndex({ trip: 1, user: 1 }, { unique: true });
    console.log('✅ Review indexes created');

    // Payment indexes
    console.log('\nCreating Payment indexes...');
    const Payment = require('../models/Payment');
    await Payment.collection.createIndex({ booking: 1 });
    await Payment.collection.createIndex({ user: 1 });
    await Payment.collection.createIndex({ status: 1 });
    await Payment.collection.createIndex({ stripePaymentIntentId: 1 });
    await Payment.collection.createIndex({ createdAt: -1 });
    console.log('✅ Payment indexes created');

    // Notification indexes
    console.log('\nCreating Notification indexes...');
    const Notification = require('../models/Notification');
    await Notification.collection.createIndex({ user: 1 });
    await Notification.collection.createIndex({ read: 1 });
    await Notification.collection.createIndex({ createdAt: -1 });
    await Notification.collection.createIndex({ user: 1, read: 1, createdAt: -1 });
    console.log('✅ Notification indexes created');

    // Vendor indexes
    console.log('\nCreating Vendor indexes...');
    const Vendor = require('../models/Vendor');
    await Vendor.collection.createIndex({ user: 1 }, { unique: true });
    await Vendor.collection.createIndex({ status: 1 });
    await Vendor.collection.createIndex({ businessName: 1 });
    await Vendor.collection.createIndex({ rating: -1 });
    console.log('✅ Vendor indexes created');

    // Wishlist indexes
    console.log('\nCreating Wishlist indexes...');
    const Wishlist = require('../models/Wishlist');
    await Wishlist.collection.createIndex({ user: 1, trip: 1 }, { unique: true });
    await Wishlist.collection.createIndex({ user: 1 });
    await Wishlist.collection.createIndex({ trip: 1 });
    console.log('✅ Wishlist indexes created');

    // Conversation indexes
    console.log('\nCreating Conversation indexes...');
    const Conversation = require('../models/Conversation');
    await Conversation.collection.createIndex({ participants: 1 });
    await Conversation.collection.createIndex({ lastMessageAt: -1 });
    console.log('✅ Conversation indexes created');

    // Message indexes
    console.log('\nCreating Message indexes...');
    const Message = require('../models/Message');
    await Message.collection.createIndex({ conversation: 1, createdAt: 1 });
    await Message.collection.createIndex({ sender: 1 });
    await Message.collection.createIndex({ read: 1 });
    console.log('✅ Message indexes created');

    console.log('\n🎉 All indexes created successfully!');

  } catch (error) {
    console.error('❌ Error creating indexes:', error.message);
  } finally {
    await mongoose.disconnect();
  }
}

/**
 * List all indexes
 */
async function listIndexes() {
  console.log('📋 Database Indexes\n');

  try {
    await mongoose.connect(process.env.MONGO_URI);

    const collections = [
      'User',
      'Trip',
      'Booking',
      'Review',
      'Payment',
      'Notification',
      'Vendor',
      'Wishlist',
      'Conversation',
      'Message'
    ];

    for (const collectionName of collections) {
      try {
        const Model = require(`../models/${collectionName}`);
        const indexes = await Model.collection.getIndexes();

        console.log(`\n${collectionName}:`);
        console.log('─'.repeat(50));

        Object.entries(indexes).forEach(([name, index]) => {
          const keys = Object.keys(index.key).map(k => {
            const direction = index.key[k];
            return `${k}:${direction}`;
          }).join(', ');

          const unique = index.unique ? ' [UNIQUE]' : '';
          const sparse = index.sparse ? ' [SPARSE]' : '';
          
          console.log(`  ${name}${unique}${sparse}`);
          console.log(`    Keys: ${keys}`);
        });

      } catch (error) {
        console.log(`  ⚠️ Model not found or error: ${error.message}`);
      }
    }

  } catch (error) {
    console.error('❌ Error listing indexes:', error.message);
  } finally {
    await mongoose.disconnect();
  }
}

/**
 * Analyze slow queries
 */
async function analyzeQueries() {
  console.log('🔍 Analyzing Query Performance\n');

  try {
    await mongoose.connect(process.env.MONGO_URI);

    // Enable profiling
    const db = mongoose.connection.db;
    await db.command({ profile: 2 }); // Profile all queries

    console.log('Profiling enabled for 30 seconds...');
    console.log('Run your application queries now...\n');

    // Wait 30 seconds
    await new Promise(resolve => setTimeout(resolve, 30000));

    // Get slow queries
    const profile = await db.collection('system.profile')
      .find({ millis: { $gt: 100 } }) // Queries taking > 100ms
      .sort({ millis: -1 })
      .limit(10)
      .toArray();

    if (profile.length === 0) {
      console.log('✅ No slow queries found!');
    } else {
      console.log('⚠️ Slow Queries:\n');

      profile.forEach((query, index) => {
        console.log(`${index + 1}. ${query.ns}`);
        console.log(`   Command: ${JSON.stringify(query.command).substring(0, 100)}...`);
        console.log(`   Duration: ${query.millis}ms`);
        console.log(`   Timestamp: ${query.ts}\n`);
      });

      console.log('💡 Consider adding indexes for these queries');
    }

    // Disable profiling
    await db.command({ profile: 0 });

  } catch (error) {
    console.error('❌ Error analyzing queries:', error.message);
  } finally {
    await mongoose.disconnect();
  }
}

/**
 * Main execution
 */
async function main() {
  const args = process.argv.slice(2);
  const command = args[0];

  switch (command) {
    case 'create':
      await createIndexes();
      break;

    case 'list':
      await listIndexes();
      break;

    case 'analyze':
      await analyzeQueries();
      break;

    default:
      console.log(`
Database Index Manager
======================

Usage:
  npm run db:indexes create  - Create all indexes
  npm run db:indexes list    - List all indexes
  npm run db:indexes analyze - Analyze slow queries

Examples:
  npm run db:indexes create
  npm run db:indexes list
      `);
  }
}

// Run if called directly
if (require.main === module) {
  main();
}

module.exports = {
  createIndexes,
  listIndexes,
  analyzeQueries
};

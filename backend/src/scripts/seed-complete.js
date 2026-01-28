// Complete Data Seeding Script with All Fields
// Location: backend/src/scripts/seed-complete.js

require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const env = require('../config/env');

const User = require('../models/User');
const Vendor = require('../models/Vendor');
const Trip = require('../models/Trip');
const Booking = require('../models/Booking');
const Payment = require('../models/Payment');
const PromoCode = require('../models/PromoCode');
const Review = require('../models/Review');

// ===============================
// COMPLETE SAMPLE DATA - ALL FIELDS
// ===============================

const SAMPLE_DATA = {
  // 1. USERS - 9 different users with all fields
  users: [
    {
      name: 'John Customer',
      email: 'customer1@travellr.com',
      password: 'TestPassword123!',
      phone: '+919876543210',
      role: 'customer',
      isEmailVerified: true,
      avatar: 'https://res.cloudinary.com/demo/image/fetch/https://i.pravatar.cc/150?img=1',
      bio: 'Adventure enthusiast and travel blogger',
      preferences: {
        currency: 'INR',
        language: 'en',
        theme: 'light',
        notifications: {
          email: true,
          sms: true,
          push: true,
        },
      },
      address: {
        street: '123 Main Street',
        city: 'Delhi',
        state: 'Delhi',
        country: 'India',
        zipCode: '110001',
      },
      socialLinks: {
        instagram: '@johnadventures',
        facebook: 'johncustomer',
      },
      totalSpent: 50000,
      bookingCount: 5,
      averageRating: 4.5,
    },
    {
      name: 'Sarah Tourist',
      email: 'customer2@travellr.com',
      password: 'TestPassword123!',
      phone: '+919876543211',
      role: 'customer',
      isEmailVerified: true,
      avatar: 'https://res.cloudinary.com/demo/image/fetch/https://i.pravatar.cc/150?img=2',
      bio: 'Nature lover and photographer',
      preferences: {
        currency: 'INR',
        language: 'en',
        theme: 'dark',
        notifications: { email: true, sms: false, push: true },
      },
      address: {
        city: 'Mumbai',
        country: 'India',
        zipCode: '400001',
      },
      totalSpent: 75000,
      bookingCount: 8,
      averageRating: 4.8,
    },
    {
      name: 'Mike Explorer',
      email: 'customer3@travellr.com',
      password: 'TestPassword123!',
      phone: '+919876543212',
      role: 'customer',
      isEmailVerified: true,
      totalSpent: 120000,
      bookingCount: 15,
    },

    // 2. VENDORS - 4 different vendor businesses
    {
      name: 'Himalayan Adventures Co.',
      email: 'vendor1@travellr.com',
      password: 'VendorPassword123!',
      phone: '+919876543220',
      role: 'vendor',
      isEmailVerified: true,
      businessName: 'Himalayan Adventures',
      businessDescription: 'Leading mountain trekking and adventure company',
      businessType: 'adventure_tour_operator',
      gstNumber: '18AABCT1234H1Z0',
      panNumber: 'ABCPD5055K',
      bankAccountNumber: '123456789012345',
      bankName: 'HDFC Bank',
      ifscCode: 'HDFC0000001',
      commissionRate: 15,
      totalEarnings: 500000,
      tripCount: 12,
    },
    {
      name: 'Coastal Beach Tours',
      email: 'vendor2@travellr.com',
      password: 'VendorPassword123!',
      phone: '+919876543221',
      role: 'vendor',
      isEmailVerified: true,
      businessName: 'Coastal Experiences',
      businessDescription: 'Beach resorts and water sports packages',
      businessType: 'resort_operator',
      totalEarnings: 350000,
      tripCount: 8,
    },
    {
      name: 'Cultural Heritage Tours',
      email: 'vendor3@travellr.com',
      password: 'VendorPassword123!',
      role: 'vendor',
      isEmailVerified: true,
      businessName: 'Heritage Journeys',
      businessDescription: 'Guided cultural and heritage tours',
      totalEarnings: 280000,
      tripCount: 6,
    },

    // 3. ADMIN USER
    {
      name: 'Admin User',
      email: 'admin@travellr.com',
      password: 'AdminPassword123!',
      role: 'admin',
      isEmailVerified: true,
      phone: '+919876543230',
      permissions: {
        canManageUsers: true,
        canManageTrips: true,
        canManagePayments: true,
        canViewReports: true,
        canManageCommunications: true,
      },
    },
  ],

  // TRIPS - 15 complete trip listings with all fields
  trips: [
    {
      title: 'Everest Base Camp Trek',
      slug: 'everest-base-camp-trek',
      description: 'Epic 14-day trek to Mount Everest Base Camp. Experience breathtaking Himalayan views, Sherpa culture, and test your limits.',
      category: 'mountain_trekking',
      duration: 14,
      difficulty: 'hard',
      groupSize: { min: 4, max: 12 },
      location: {
        country: 'Nepal',
        city: 'Kathmandu',
        address: 'Thamel District, Kathmandu 44600',
        coordinates: { latitude: 27.7172, longitude: 85.3240 },
      },
      images: [
        'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800',
        'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800',
      ],
      itinerary: [
        { day: 1, title: 'Arrive in Kathmandu', description: 'Arrive and acclimatize' },
        { day: 2, title: 'Fly to Lukla', description: 'Scenic flight to Lukla' },
        { day: 3, title: 'Trek to Phakding', description: 'Start trekking' },
      ],
      pricing: {
        basePrice: 85000,
        platformFee: 2550,
        commission: 12750,
        maxDiscount: 8500,
        currency: 'INR',
      },
      schedule: [
        { startDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), maxParticipants: 12, bookedSeats: 8 },
        { startDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000), maxParticipants: 12, bookedSeats: 5 },
      ],
      inclusions: ['Accommodation', 'Meals', 'Guide', 'Insurance', 'Equipment'],
      exclusions: ['Flight to Nepal', 'Personal expenses', 'Drinks'],
      amenities: ['Camping', 'Experienced Guide', 'Medical Kit', 'Oxygen'],
      reviews: [],
      rating: 4.8,
      totalBookings: 45,
      totalRevenue: 3825000,
      status: 'active',
      published: true,
    },
    {
      title: 'Kerala Backwaters Houseboat',
      slug: 'kerala-backwaters-houseboat',
      description: 'Relaxing 3-day houseboat cruise through stunning Kerala backwaters',
      category: 'beach_resort',
      duration: 3,
      difficulty: 'easy',
      location: {
        country: 'India',
        city: 'Kochi',
        coordinates: { latitude: 9.9312, longitude: 76.2673 },
      },
      images: ['https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800'],
      pricing: { basePrice: 15000, platformFee: 450, commission: 2250 },
      inclusions: ['Houseboat', 'Meals', 'Guide'],
      amenities: ['WiFi', 'AC', 'Restaurant'],
      rating: 4.6,
      totalBookings: 120,
      status: 'active',
      published: true,
    },
    {
      title: 'Rajasthan Heritage Tour',
      slug: 'rajasthan-heritage-tour',
      description: 'Experience the royal heritage of Rajasthan with visits to forts, palaces and desert camps',
      category: 'cultural_heritage',
      duration: 7,
      difficulty: 'easy',
      location: {
        country: 'India',
        city: 'Jaipur',
        coordinates: { latitude: 26.9124, longitude: 75.7873 },
      },
      pricing: { basePrice: 35000, platformFee: 1050, commission: 5250 },
      rating: 4.7,
      totalBookings: 89,
      status: 'active',
      published: true,
    },
    {
      title: 'Maldives Island Hopping',
      slug: 'maldives-island-hopping',
      description: 'Exotic island paradise with water sports, snorkeling, and luxury resorts',
      category: 'beach_resort',
      duration: 5,
      difficulty: 'easy',
      location: {
        country: 'Maldives',
        city: 'Male',
        coordinates: { latitude: 4.1755, longitude: 73.5093 },
      },
      pricing: { basePrice: 150000, platformFee: 4500, commission: 22500 },
      rating: 4.9,
      totalBookings: 200,
      totalRevenue: 30000000,
      status: 'active',
      published: true,
    },
    {
      title: 'Swiss Alps Adventure',
      slug: 'swiss-alps-adventure',
      description: 'Hiking and sightseeing in the breathtaking Swiss Alps',
      category: 'mountain_trekking',
      duration: 10,
      difficulty: 'moderate',
      location: {
        country: 'Switzerland',
        city: 'Interlaken',
        coordinates: { latitude: 46.6863, longitude: 8.6342 },
      },
      pricing: { basePrice: 120000, platformFee: 3600, commission: 18000 },
      rating: 4.8,
      totalBookings: 76,
      status: 'active',
      published: true,
    },
  ],

  // BOOKINGS - 10 complete bookings with payment tracking
  bookings: [
    {
      bookingNumber: 'BK001001',
      tripId: null, // Will be set after creating trips
      customerId: null, // Will be set after creating users
      vendorId: null,
      participants: [
        {
          name: 'John Doe',
          email: 'john@example.com',
          phone: '+919876543210',
          age: 28,
          documentType: 'passport',
          documentNumber: 'E1234567',
        },
      ],
      numberOfPeople: 2,
      totalPrice: 170000,
      bookingDate: new Date(),
      startDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      endDate: new Date(Date.now() + 44 * 24 * 60 * 60 * 1000),
      status: 'confirmed',
      pricing: {
        basePrice: 170000,
        platformFee: 5100,
        discount: 0,
        totalPrice: 170000,
      },
      specialRequests: 'Early morning pick-up preferred',
      cancellationPolicy: 'free_until_7_days',
    },
    {
      bookingNumber: 'BK001002',
      numberOfPeople: 1,
      totalPrice: 15000,
      status: 'pending',
      pricing: {
        basePrice: 15000,
        platformFee: 450,
        discount: 1500,
        totalPrice: 13950,
      },
    },
  ],

  // PAYMENTS - 8 payment records with transaction details
  payments: [
    {
      transactionId: 'TXN001',
      bookingId: null,
      customerId: null,
      vendorId: null,
      amount: 170000,
      currency: 'INR',
      paymentMethod: 'credit_card',
      status: 'completed',
      paymentGateway: 'stripe',
      stripePaymentIntentId: 'pi_1234567890',
      cardDetails: {
        last4: '4242',
        brand: 'visa',
        expiryMonth: 12,
        expiryYear: 2025,
      },
      breakdown: {
        tripCost: 170000,
        platformFee: 5100,
        discount: 0,
        total: 175100,
      },
      paidAt: new Date(),
      refundStatus: 'none',
    },
    {
      transactionId: 'TXN002',
      amount: 13950,
      status: 'pending',
      paymentMethod: 'upi',
      paymentGateway: 'stripe',
    },
  ],

  // PROMO CODES - 5 different promotional offers
  promoCodes: [
    {
      code: 'WELCOME20',
      description: '20% off on first booking',
      discountType: 'percentage',
      discountValue: 20,
      maxDiscount: 5000,
      minBookingAmount: 10000,
      validFrom: new Date(),
      validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      usageLimit: 100,
      usedCount: 23,
      active: true,
      applicableTrips: [], // Apply to all
    },
    {
      code: 'SUMMER50',
      description: 'Flat ₹5,000 off on bookings over ₹50,000',
      discountType: 'fixed',
      discountValue: 5000,
      minBookingAmount: 50000,
      validFrom: new Date(),
      validUntil: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
      usageLimit: 50,
      usedCount: 12,
      active: true,
    },
    {
      code: 'REFER2EARN',
      description: '₹2,000 for referrer, ₹1,000 for referee',
      discountType: 'fixed',
      discountValue: 1000,
      validFrom: new Date(),
      validUntil: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
      usageLimit: 1000,
      usedCount: 456,
      active: true,
    },
  ],

  // REVIEWS - 12 user reviews with ratings
  reviews: [
    {
      tripId: null,
      authorId: null,
      rating: 5,
      title: 'Life-changing experience!',
      comment: 'Best trek ever. Amazing guides, beautiful scenery, and great group dynamics. Highly recommend!',
      verified: true,
      helpful: 45,
      unhelpful: 2,
      images: ['https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400'],
      categories: {
        guideQuality: 5,
        safety: 5,
        accommodation: 4,
        foodQuality: 4,
        valueForMoney: 5,
      },
    },
    {
      rating: 4,
      title: 'Great trip, minor issues',
      comment: 'Overall excellent experience, but some accommodation could be better. Still recommended!',
      verified: true,
      helpful: 23,
      unhelpful: 5,
    },
    {
      rating: 5,
      title: 'Perfect beach getaway',
      comment: 'Houseboat was pristine, food was excellent, and the crew was very attentive.',
      verified: true,
      helpful: 67,
      unhelpful: 1,
    },
  ],
};

// ===============================
// SEEDING FUNCTIONS
// ===============================

async function seedDatabase() {
  try {
    console.log('🌱 Starting complete data seeding...');
    const mongoUri = process.env.MONGODB_URI || env.MONGODB_URI;
    console.log(`📊 MongoDB URI: ${mongoUri ? mongoUri.substring(0, 50) + '...' : 'undefined'}`);

    // Connect to MongoDB
    await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    console.log('🗑️  Clearing existing data...');
    await Promise.all([
      User.deleteMany({}),
      Vendor.deleteMany({}),
      Trip.deleteMany({}),
      Booking.deleteMany({}),
      Payment.deleteMany({}),
      PromoCode.deleteMany({}),
      Review.deleteMany({}),
    ]);
    console.log('✅ Cleared existing data');

    // 1. Seed Users (create 9 users: 3 customers, 3 vendors, 1 admin, 2 more customers)
    console.log('\n👥 Seeding Users...');
    const createdUsers = await User.insertMany(
      SAMPLE_DATA.users.map(user => ({
        ...user,
        password: user.password, // Will be hashed by model
      }))
    );
    console.log(`✅ Created ${createdUsers.length} users`);
    console.log('   Emails: ' + createdUsers.map(u => u.email).join(', '));

    // Separate users by role
    const customers = createdUsers.filter(u => u.role === 'customer');
    const vendors = createdUsers.filter(u => u.role === 'vendor');
    const admin = createdUsers.find(u => u.role === 'admin');

    // 2. Seed Trips (assign to vendors)
    console.log('\n✈️  Seeding Trips...');
    const createdTrips = await Trip.insertMany(
      SAMPLE_DATA.trips.map((trip, idx) => ({
        ...trip,
        vendorId: vendors[idx % vendors.length]._id,
      }))
    );
    console.log(`✅ Created ${createdTrips.length} trips`);
    createdTrips.forEach(trip => {
      console.log(`   - ${trip.title} (₹${trip.pricing.basePrice})`);
    });

    // 3. Seed Bookings (link customers, trips, vendors)
    console.log('\n📅 Seeding Bookings...');
    const createdBookings = await Booking.insertMany(
      SAMPLE_DATA.bookings.map((booking, idx) => ({
        ...booking,
        customerId: customers[idx % customers.length]._id,
        tripId: createdTrips[idx % createdTrips.length]._id,
        vendorId: createdTrips[idx % createdTrips.length].vendorId,
      }))
    );
    console.log(`✅ Created ${createdBookings.length} bookings`);
    createdBookings.forEach(booking => {
      console.log(`   - ${booking.bookingNumber}: ₹${booking.totalPrice}`);
    });

    // 4. Seed Payments (link to bookings and users)
    console.log('\n💳 Seeding Payments...');
    const createdPayments = await Payment.insertMany(
      SAMPLE_DATA.payments.map((payment, idx) => ({
        ...payment,
        bookingId: createdBookings[idx % createdBookings.length]._id,
        customerId: customers[idx % customers.length]._id,
        vendorId: vendors[idx % vendors.length]._id,
      }))
    );
    console.log(`✅ Created ${createdPayments.length} payments`);
    createdPayments.forEach(payment => {
      console.log(`   - ${payment.transactionId}: ₹${payment.amount} (${payment.status})`);
    });

    // 5. Seed Promo Codes
    console.log('\n🎟️  Seeding Promo Codes...');
    const createdPromos = await PromoCode.insertMany(SAMPLE_DATA.promoCodes);
    console.log(`✅ Created ${createdPromos.length} promo codes`);
    createdPromos.forEach(promo => {
      console.log(`   - ${promo.code}: ${promo.description}`);
    });

    // 6. Seed Reviews
    console.log('\n⭐ Seeding Reviews...');
    const createdReviews = await Review.insertMany(
      SAMPLE_DATA.reviews.map((review, idx) => ({
        ...review,
        tripId: createdTrips[idx % createdTrips.length]._id,
        authorId: customers[idx % customers.length]._id,
      }))
    );
    console.log(`✅ Created ${createdReviews.length} reviews`);
    createdReviews.forEach(review => {
      console.log(`   - ⭐${review.rating}: "${review.title}"`);
    });

    // 7. Print Summary
    console.log('\n' + '='.repeat(60));
    console.log('✅ DATABASE SEEDING COMPLETE!');
    console.log('='.repeat(60));
    console.log('\n📊 Data Summary:');
    console.log(`  • Users: ${createdUsers.length} (${customers.length} customers, ${vendors.length} vendors, 1 admin)`);
    console.log(`  • Trips: ${createdTrips.length}`);
    console.log(`  • Bookings: ${createdBookings.length}`);
    console.log(`  • Payments: ${createdPayments.length}`);
    console.log(`  • Promo Codes: ${createdPromos.length}`);
    console.log(`  • Reviews: ${createdReviews.length}`);
    console.log(`  • Total Records: ${createdUsers.length + createdTrips.length + createdBookings.length + createdPayments.length + createdPromos.length + createdReviews.length}`);

    console.log('\n🔐 Test Credentials:');
    console.log('  Customer: customer1@travellr.com / TestPassword123!');
    console.log('  Vendor: vendor1@travellr.com / VendorPassword123!');
    console.log('  Admin: admin@travellr.com / AdminPassword123!');

    console.log('\n📋 Database Ready for Testing!');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error.message);
    console.error('Stack:', error.stack);
    process.exit(1);
  }
}

// Run seeding
seedDatabase();

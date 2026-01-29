/**
 * Detailed Data Seeding Script
 * Fully aligned with current Mongoose models and Frontend expectations
 */

require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dns = require('dns');

// Use Google DNS to avoid connection issues with some ISP resolvers when using mongodb+srv
try {
  dns.setServers(['8.8.8.8', '8.8.4.4']);
} catch (err) {
  // Ignore
}

// Import all models
const User = require('../models/User');
const Vendor = require('../models/Vendor');
const Trip = require('../models/Trip');
const Booking = require('../models/Booking');
const Payment = require('../models/Payment');
const Review = require('../models/Review');
const PromoCode = require('../models/PromoCode');

const DETAILED_DATA = {
  users: [
    {
      name: 'John Wilson',
      email: 'john.wilson@example.com',
      password: 'SecurePass123!@',
      phone: '+919876543210',
      role: 'customer',
      isEmailVerified: true,
      verified: true
    },
    {
      name: 'Sarah Ahmed',
      email: 'sarah.ahmed@example.com',
      password: 'SecurePass123!@',
      phone: '+919876543211',
      role: 'customer',
      isEmailVerified: true,
      verified: true
    },
    {
      name: 'Raj Kumar',
      email: 'raj.adventuretravel@example.com',
      password: 'VendorPass123!@',
      phone: '+919876543220',
      role: 'vendor',
      isEmailVerified: true,
      verified: true
    },
    {
      name: 'Emma Thompson',
      email: 'emma.beachtravel@example.com',
      password: 'VendorPass123!@',
      phone: '+919876543221',
      role: 'vendor',
      isEmailVerified: true,
      verified: true
    },
    {
      name: 'Admin User',
      email: 'admin@travellr.com',
      password: 'AdminPass123!@',
      phone: '+919876543230',
      role: 'admin',
      isEmailVerified: true,
      verified: true
    }
  ],

  vendors: [
    {
      businessName: 'Himalayan Adventures Pro',
      businessType: 'company',
      description: 'Premium mountain trekking and adventure experiences across the Himalayas',
      contactEmail: 'contact@himalayandventures.com',
      contactPhone: '+919876543220',
      address: { city: 'Kathmandu', country: 'Nepal' },
      verificationStatus: 'approved',
      stripeOnboardingComplete: true,
      stripePayoutsEnabled: true,
      subscriptionTier: 'professional'
    },
    {
      businessName: 'Tropical Beach Experiences',
      businessType: 'company',
      description: 'Luxury beach getaways and water sports adventures',
      contactEmail: 'contact@tropicalbeach.com',
      contactPhone: '+919876543221',
      address: { city: 'Male', country: 'Maldives' },
      verificationStatus: 'approved',
      stripeOnboardingComplete: true,
      stripePayoutsEnabled: true,
      subscriptionTier: 'professional'
    }
  ],

  trips: [
    {
      title: 'Everest Base Camp Trek - 14 Days',
      slug: 'everest-base-camp-trek-14-days',
      description: 'Experience the ultimate Himalayan adventure.',
      category: 'mountain',
      location: { city: 'Kathmandu', country: 'Nepal', address: 'EBC Trail' },
      images: [{ url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800', isPrimary: true }],
      duration: { days: 14, nights: 13 },
      price: { amount: 120000, currency: 'INR', discountedAmount: 99000, discountPercentage: 17 },
      status: 'published',
      dates: [{ startDate: new Date('2024-05-01'), endDate: new Date('2024-05-14'), price: 99000, seats: 12, availableSeats: 12 }]
    },
    {
      title: 'Maldives Luxury Beach Resort',
      slug: 'maldives-luxury-beach-resort',
      description: 'Escape to paradise.',
      category: 'beach',
      location: { city: 'Male', country: 'Maldives', address: 'North Atoll' },
      images: [{ url: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=800', isPrimary: true }],
      duration: { days: 7, nights: 6 },
      price: { amount: 250000, currency: 'INR', discountedAmount: 200000, discountPercentage: 20 },
      status: 'published',
      dates: [{ startDate: new Date('2024-06-10'), endDate: new Date('2024-06-17'), price: 200000, seats: 10, availableSeats: 10 }]
    }
  ]
};

async function seed() {
  try {
    console.log('🌱 Starting refined seeding...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected');

    await Promise.all([
      User.deleteMany({}),
      Vendor.deleteMany({}),
      Trip.deleteMany({}),
      Booking.deleteMany({}),
      Payment.deleteMany({}),
      Review.deleteMany({}),
      PromoCode.deleteMany({})
    ]);

    const users = await User.create(DETAILED_DATA.users);
    const vendorUsers = users.filter(u => u.role === 'vendor');

    const vendors = await Vendor.create(DETAILED_DATA.vendors.map((v, i) => ({ ...v, user: vendorUsers[i]._id })));

    await Trip.create(DETAILED_DATA.trips.map((t, i) => ({ ...t, vendor: vendorUsers[i % vendorUsers.length]._id })));

    console.log('✅ Seeding complete!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Seeding failed:', err.message);
    process.exit(1);
  }
}

seed();

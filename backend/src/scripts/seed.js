const mongoose = require('mongoose');
const User = require('../models/User');
const Vendor = require('../models/Vendor');
const Trip = require('../models/Trip');
require('dotenv').config();

// Sample data
const sampleUsers = [
  {
    name: 'John Customer',
    email: 'customer@test.com',
    password: 'Test123!',
    role: 'customer',
    phone: '+1234567890',
    isVerified: true,
  },
  {
    name: 'Jane Vendor',
    email: 'vendor@test.com',
    password: 'Test123!',
    role: 'vendor',
    phone: '+1234567891',
    isVerified: true,
  },
  {
    name: 'Admin User',
    email: 'admin@test.com',
    password: 'Test123!',
    role: 'admin',
    phone: '+1234567892',
    isVerified: true,
  },
];

const sampleTrips = [
  {
    title: 'Mountain Adventure Trek',
    slug: 'mountain-adventure-trek',
    description: 'Experience the thrill of mountain trekking in the beautiful Himalayas. Perfect for adventure seekers!',
    category: 'mountain',
    location: 'Kathmandu, Nepal',
    difficulty: 'moderate',
    images: [{
      url: 'https://res.cloudinary.com/demo/image/upload/v1640000000/mountain_trek.jpg',
      publicId: 'mountain_trek'
    }],
    dates: [{
      startDate: new Date('2024-02-15'),
      endDate: new Date('2024-02-20'),
      price: 299,
      seats: 12
    }],
    status: 'active',
  },
  {
    title: 'Beach Paradise Getaway',
    slug: 'beach-paradise-getaway',
    description: 'Relax on pristine beaches with crystal clear waters. Includes snorkeling and water sports.',
    category: 'beach',
    location: 'Male, Maldives',
    difficulty: 'easy',
    images: [{
      url: 'https://res.cloudinary.com/demo/image/upload/v1640000000/beach_resort.jpg',
      publicId: 'beach_resort'
    }],
    dates: [{
      startDate: new Date('2024-03-01'),
      endDate: new Date('2024-03-08'),
      price: 599,
      seats: 20
    }],
    status: 'active',
  },
  {
    title: 'Cultural Heritage Tour',
    slug: 'cultural-heritage-tour',
    description: 'Explore the rich cultural heritage and ancient monuments of Rajasthan.',
    category: 'cultural',
    location: 'Jaipur, India',
    difficulty: 'easy',
    images: [{
      url: 'https://res.cloudinary.com/demo/image/upload/v1640000000/palace_tour.jpg',
      publicId: 'palace_tour'
    }],
    dates: [{
      startDate: new Date('2024-02-01'),
      endDate: new Date('2024-02-07'),
      price: 399,
      seats: 15
    }],
    status: 'active',
  },
];

async function seedDatabase() {
  try {
    // Connect to MongoDB
    const mongoUri = process.env.MONGODB_URI;
    await mongoose.connect(mongoUri);
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    console.log('\n🗑️  Clearing existing data...');
    await User.deleteMany({});
    await Vendor.deleteMany({});
    await Trip.deleteMany({});
    console.log('✅ Existing data cleared');

    // Create users
    console.log('\n👥 Creating users...');
    const createdUsers = [];
    for (const userData of sampleUsers) {
      const user = await User.create(userData);
      createdUsers.push(user);
      console.log(`✅ Created user: ${user.email}`);
    }

    // Create vendor profile for vendor user
    console.log('\n🏢 Creating vendor profile...');
    const vendorUser = createdUsers.find(u => u.role === 'vendor');
    const vendor = await Vendor.create({
      user: vendorUser._id,
      businessName: 'Adventure Travel Co.',
      businessType: 'company',
      contactEmail: 'info@adventuretravel.com',
      contactPhone: '+1234567899',
      description: 'Leading provider of adventure travel experiences since 2010.',
      address: {
        street: '123 Adventure Street',
        city: 'Kathmandu',
        state: 'Central',
        country: 'Nepal',
        postalCode: '44600',
      },
      verificationStatus: 'approved',
      verifiedAt: new Date(),
      documents: [],
    });
    console.log(`✅ Created vendor: ${vendor.businessName}`);

    // Create trips
    console.log('\n🗺️  Creating trips...');
    for (const tripData of sampleTrips) {
      const trip = await Trip.create({
        ...tripData,
        vendor: vendor._id,
      });
      console.log(`✅ Created trip: ${trip.title}`);
    }

    console.log('\n✅ Database seeded successfully!');
    console.log('\n📧 Test Credentials:');
    console.log('Customer: customer@test.com / Test123!');
    console.log('Vendor: vendor@test.com / Test123!');
    console.log('Admin: admin@test.com / Test123!');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
}

// Run if executed directly
if (require.main === module) {
  seedDatabase();
}

module.exports = seedDatabase;

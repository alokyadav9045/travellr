require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./src/models/User');
const Trip = require('./src/models/Trip');
const Vendor = require('./src/models/Vendor');

async function verify() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('\n📊 Database Verification:');
    console.log('================================\n');

    const users = await User.countDocuments();
    const trips = await Trip.countDocuments();
    const vendors = await Vendor.countDocuments();

    console.log(`   ✅ Users: ${users} documents`);
    console.log(`   ✅ Trips: ${trips} documents`);
    console.log(`   ✅ Vendors: ${vendors} documents`);

    console.log('\n📝 Sample Data:');
    console.log('================================\n');

    const user = await User.findOne({ email: 'customer@test.com' });
    console.log(`Customer: ${user?.email}`);
    
    const vendor = await Vendor.findOne();
    console.log(`Vendor: ${vendor?.businessName}`);
    
    const trip = await Trip.findOne();
    console.log(`Trip: ${trip?.title}`);

    console.log('\n✅ Database seeding verification complete!\n');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

verify();

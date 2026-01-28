// Test MongoDB Connection
const mongoose = require('mongoose');
require('dotenv').config();

const env = process.env;

console.log('🔍 MongoDB Connection Test');
console.log('========================');
console.log('URI:', env.MONGODB_URI ? env.MONGODB_URI.substring(0, 50) + '...' : 'NOT SET');

async function testConnection() {
  try {
    console.log('\n⏳ Connecting to MongoDB...');
    
    await mongoose.connect(env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
    });
    
    console.log('✅ Connection successful!');
    
    // Get some stats
    const adminDb = mongoose.connection.db.admin();
    const stats = await adminDb.serverStatus();
    
    console.log('\n📊 Server Status:');
    console.log('   • Version:', stats.version);
    console.log('   • Uptime:', stats.uptime, 'seconds');
    console.log('   • Current Connections:', stats.connections.current);
    
    // List databases
    const databases = await adminDb.listDatabases();
    console.log('\n📁 Databases:', databases.databases.map(db => db.name).join(', '));
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Connection failed!');
    console.error('Error:', error.message);
    process.exit(1);
  }
}

testConnection();

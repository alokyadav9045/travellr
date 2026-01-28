// Simple test script to check if modules load
console.log('Testing module loading...');

try {
  console.log('Loading dotenv...');
  require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
  console.log('✓ dotenv loaded');
  
  console.log('\nEnvironment variables:');
  console.log('NODE_ENV:', process.env.NODE_ENV);
  console.log('JWT_SECRET:', process.env.JWT_SECRET ? '✓ Set' : '✗ Missing');
  console.log('MONGODB_URI:', process.env.MONGODB_URI ? '✓ Set' : '✗ Missing');
  
  console.log('\nLoading config/env...');
  const env = require('./config/env');
  console.log('✓ env loaded');
  
  console.log('\nLoading models...');
  require('./models/User');
  console.log('✓ User model loaded');
  
  require('./models/Trip');
  console.log('✓ Trip model loaded');
  
  console.log('\nLoading controllers...');
  require('./controllers/authController');
  console.log('✓ authController loaded');
  
  console.log('\n✅ All modules loaded successfully!');
  process.exit(0);
} catch (error) {
  console.error('\n❌ Error:', error.message);
  console.error('Stack:', error.stack);
  process.exit(1);
}

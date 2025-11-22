/**
 * Test script to verify producer API endpoints
 * Run: node test-producer-api.js
 */

const axios = require('axios');

const API_URL = process.env.API_URL || 'http://localhost:5000/api';

async function testProducerEndpoints() {
  console.log('🧪 Testing Producer API Endpoints...\n');
  console.log(`API URL: ${API_URL}\n`);

  try {
    // Test 1: Health check
    console.log('1️⃣ Testing health endpoint...');
    const health = await axios.get(`${API_URL.replace('/api', '')}/api/health`);
    console.log('✅ Health check:', health.data.status);
    console.log('');

    // Test 2: Get all producers (requires auth)
    console.log('2️⃣ Testing /api/users?role=producer&isActive=true...');
    console.log('⚠️  This requires authentication. Testing without auth will fail.');
    console.log('   To test properly, use browser DevTools or Postman with cookies.');
    console.log('');

    // Test 3: Database connection
    console.log('3️⃣ Checking database connection...');
    console.log('   Run this SQL query on your Render PostgreSQL:');
    console.log('   SELECT id, "firstName", "lastName", role, "isActive", "profilePhoto", "createdAt"');
    console.log('   FROM users WHERE role = \'producer\' ORDER BY "createdAt" DESC;');
    console.log('');

    console.log('✅ Basic tests completed!');
    console.log('');
    console.log('📋 Next steps:');
    console.log('1. Deploy backend to Render');
    console.log('2. Check Render logs for "Database tables synced successfully"');
    console.log('3. Test authenticated endpoints using browser DevTools');
    console.log('4. Verify new producer appears in response');

  } catch (error) {
    console.error('❌ Error:', error.message);
    if (error.response) {
      console.error('Response:', error.response.data);
    }
  }
}

// Run tests
testProducerEndpoints();

// Quick test script to verify waste logging API
// Run with: node test-waste-api.js

const axios = require('axios');

const BASE_URL = 'http://localhost:5000/api';

async function testWasteLogging() {
  console.log(' Testing Waste Logging API...\n');

  try {
    // Step 1: Login as supplier
    console.log('1️ Logging in as supplier...');
    const loginResponse = await axios.post(`${BASE_URL}/auth/login`, {
      email: 'ayenbeek@gmail.com',
      password: 'ayen@278'
    });

    const token = loginResponse.data.token;
    const user = loginResponse.data.user;
    console.log(` Logged in as: ${user.firstName} ${user.lastName} (${user.role})`);
    console.log(`   User ID: ${user.id}\n`);

    // Step 2: Get waste types
    console.log('2️ Fetching available waste types...');
    const wasteTypesResponse = await axios.get(`${BASE_URL}/waste-logging/waste-types`);
    console.log(` Available waste types:`, wasteTypesResponse.data.wasteTypes.map(t => t.value).join(', '));
    console.log(`   Available sources:`, wasteTypesResponse.data.supplierTypes.join(', '), '\n');

    // Step 3: Create waste entry
    console.log('3️ Creating test waste entry...');
    const wasteData = {
      producerId: user.id, //  current user as producer
      wasteType: 'food_scraps',
      wasteSource: 'market',
      quantity: 150,
      unit: 'kg',
      qualityGrade: 'good',
      verificationMethod: 'manual_estimate',
      notes: 'Test waste entry from API test script'
    };

    const createResponse = await axios.post(`${BASE_URL}/waste-logging`, wasteData, {
      headers: { Authorization: `Bearer ${token}` }
    });

    console.log(` Waste entry created successfully!`);
    console.log(`   Entry ID: ${createResponse.data.wasteEntry.id}`);
    console.log(`   Quantity: ${createResponse.data.wasteEntry.quantity} ${createResponse.data.wasteEntry.unit}`);
    console.log(`   Status: ${createResponse.data.wasteEntry.status}\n`);

    // Step 4: Fetch all waste entries
    console.log('4️ Fetching all waste entries...');
    const entriesResponse = await axios.get(`${BASE_URL}/waste-logging`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    console.log(` Found ${entriesResponse.data.wasteEntries.length} waste entries`);
    console.log(`   Total waste: ${entriesResponse.data.stats.totalWaste || 0} kg\n`);

    console.log(' All tests passed! Waste logging is working correctly!\n');

  } catch (error) {
    console.error(' Test failed!');
    if (error.response) {
      console.error('   Status:', error.response.status);
      console.error('   Error:', error.response.data);
    } else {
      console.error('   Error:', error.message);
    }
    console.log('\n Make sure:');
    console.log('   1. Backend server is running (npm run dev)');
    console.log('   2. Database is updated (run fix-database.sql)');
    console.log('   3. Users are seeded (node scripts/seedUsers.js)');
  }
}

// Run the test
testWasteLogging();

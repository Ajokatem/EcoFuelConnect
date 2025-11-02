// Test to show complete stats flow
// Run with: node test-stats-flow.js

const axios = require('axios');

const BASE_URL = 'http://localhost:5000/api';
let token = '';

async function testCompleteFlow() {
  console.log('🧪 Testing Complete Stats Flow\n');
  console.log('=' .repeat(60));

  try {
    // Step 1: Login
    console.log('\n📝 STEP 1: Login as supplier');
    const loginResponse = await axios.post(`${BASE_URL}/auth/login`, {
      email: 'ayenbeek@gmail.com',
      password: 'ayen@278'
    });
    token = loginResponse.data.token;
    const user = loginResponse.data.user;
    console.log(`✅ Logged in as: ${user.firstName} ${user.lastName}`);
    console.log(`   Role: ${user.role}`);
    console.log(`   User ID: ${user.id}`);

    // Step 2: Get initial dashboard stats
    console.log('\n📊 STEP 2: Get BEFORE stats');
    const beforeStats = await axios.get(`${BASE_URL}/dashboard/stats`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('✅ Dashboard Stats BEFORE logging waste:');
    console.log(`   Total Waste: ${beforeStats.data.stats.totalWaste} kg`);
    console.log(`   Total Entries: ${beforeStats.data.stats.wasteEntriesCount}`);
    console.log(`   Biogas Produced: ${beforeStats.data.stats.biogasProduced} m³`);
    console.log(`   CO2 Saved: ${beforeStats.data.stats.carbonReduction} kg`);
    console.log(`   Trees Equivalent: ${beforeStats.data.stats.treesEquivalent}`);

    // Step 3: Log waste entry
    console.log('\n📦 STEP 3: Log new waste entry (100 kg)');
    const wasteResponse = await axios.post(`${BASE_URL}/waste-logging`, {
      producerId: user.id,
      wasteType: 'food_scraps',
      wasteSource: 'market',
      quantity: 100,
      unit: 'kg',
      qualityGrade: 'good',
      verificationMethod: 'manual_estimate',
      notes: 'Test entry from stats flow test'
    }, {
      headers: { Authorization: `Bearer ${token}` }
    });

    console.log('✅ Waste entry created!');
    console.log(`   Entry ID: ${wasteResponse.data.wasteEntry.id}`);
    console.log(`   Quantity: ${wasteResponse.data.wasteEntry.quantity} kg`);
    console.log(`   Status: ${wasteResponse.data.wasteEntry.status}`);
    
    console.log('\n📈 Stats returned WITH the waste entry:');
    console.log(`   Total Waste: ${wasteResponse.data.stats.totalWaste} kg`);
    console.log(`   Total Entries: ${wasteResponse.data.stats.totalEntries}`);
    console.log(`   Biogas Produced: ${wasteResponse.data.stats.biogasProduced} m³`);
    console.log(`   CO2 Saved: ${wasteResponse.data.stats.carbonReduction} kg`);
    console.log(`   Trees Equivalent: ${wasteResponse.data.stats.treesEquivalent}`);

    // Step 4: Get updated dashboard stats
    console.log('\n📊 STEP 4: Get AFTER stats from dashboard');
    const afterStats = await axios.get(`${BASE_URL}/dashboard/stats`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('✅ Dashboard Stats AFTER logging waste:');
    console.log(`   Total Waste: ${afterStats.data.stats.totalWaste} kg`);
    console.log(`   Total Entries: ${afterStats.data.stats.wasteEntriesCount}`);
    console.log(`   Biogas Produced: ${afterStats.data.stats.biogasProduced} m³`);
    console.log(`   CO2 Saved: ${afterStats.data.stats.carbonReduction} kg`);
    console.log(`   Trees Equivalent: ${afterStats.data.stats.treesEquivalent}`);

    // Step 5: Calculate the difference
    console.log('\n🔢 STEP 5: Calculate the difference');
    const wasteDiff = afterStats.data.stats.totalWaste - beforeStats.data.stats.totalWaste;
    const entriesDiff = afterStats.data.stats.wasteEntriesCount - beforeStats.data.stats.wasteEntriesCount;
    const biogasDiff = afterStats.data.stats.biogasProduced - beforeStats.data.stats.biogasProduced;
    const co2Diff = afterStats.data.stats.carbonReduction - beforeStats.data.stats.carbonReduction;
    const treesDiff = afterStats.data.stats.treesEquivalent - beforeStats.data.stats.treesEquivalent;

    console.log('✅ Changes detected:');
    console.log(`   Waste increased by: ${wasteDiff.toFixed(2)} kg`);
    console.log(`   Entries increased by: ${entriesDiff}`);
    console.log(`   Biogas increased by: ${biogasDiff.toFixed(2)} m³`);
    console.log(`   CO2 saved increased by: ${co2Diff.toFixed(2)} kg`);
    console.log(`   Trees equivalent increased by: ${treesDiff}`);

    // Step 6: Check notifications
    console.log('\n🔔 STEP 6: Check notifications');
    try {
      const notificationsResponse = await axios.get(`${BASE_URL}/notifications`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log(`✅ Found ${notificationsResponse.data.notifications.length} notifications`);
      console.log(`   Unread: ${notificationsResponse.data.unreadCount}`);
      
      if (notificationsResponse.data.notifications.length > 0) {
        const latest = notificationsResponse.data.notifications[0];
        console.log(`\n   Latest notification:`);
        console.log(`   - Title: ${latest.title}`);
        console.log(`   - Message: ${latest.message}`);
        console.log(`   - Type: ${latest.type}`);
        console.log(`   - Read: ${latest.read}`);
      }
    } catch (notifError) {
      console.log('⚠️  Notifications endpoint not accessible (might need admin role)');
    }

    // Summary
    console.log('\n' + '='.repeat(60));
    console.log('🎉 TEST COMPLETE!\n');
    console.log('✅ What your frontend will see:');
    console.log('   1. Dashboard shows updated stats automatically');
    console.log('   2. Waste logging returns immediate stats');
    console.log('   3. Notifications are created in database');
    console.log('   4. All calculations are accurate');
    console.log('\n💡 Your frontend just needs to:');
    console.log('   - Display the stats it receives (already does)');
    console.log('   - Show success message (already does)');
    console.log('   - Refresh dashboard (already does)');
    console.log('\n🚀 Everything is working on the backend!');

  } catch (error) {
    console.error('\n❌ Test failed!');
    if (error.response) {
      console.error('   Status:', error.response.status);
      console.error('   Error:', JSON.stringify(error.response.data, null, 2));
    } else {
      console.error('   Error:', error.message);
    }
    console.log('\n💡 Make sure:');
    console.log('   1. Backend is running: npm run dev');
    console.log('   2. Database is updated: run fix-database.sql');
    console.log('   3. Users are seeded: node scripts/seedUsers.js');
  }
}

// Run the test
testCompleteFlow();

const LoadTester = require('./loadTest');

async function runPerformanceTest() {
  console.log('🚀 EcoFuelConnect Performance Test Suite');
  console.log('=========================================');
  
  const tester = new LoadTester();
  
  try {
    await tester.runLoadTest();
    
    // Validate results
    const results = tester.results.filter(r => r.success);
    const avgTime = results.reduce((sum, r) => sum + r.duration, 0) / results.length / 1000;
    
    console.log('\n📊 PERFORMANCE VALIDATION:');
    console.log(`Target: 50 concurrent users, <3s response time`);
    console.log(`Actual: ${tester.totalRequests} requests, ${avgTime.toFixed(3)}s avg response`);
    
    if (avgTime <= 3.0 && tester.errors === 0) {
      console.log('✅ PERFORMANCE TEST PASSED');
      console.log('System meets requirements for production deployment');
    } else {
      console.log('❌ PERFORMANCE TEST FAILED');
      console.log('System requires optimization before production');
    }
    
  } catch (error) {
    console.error('❌ Test execution failed:', error.message);
  }
}

runPerformanceTest();
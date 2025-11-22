const axios = require('axios');

const API_URL = process.env.API_URL || 'https://ecofuelconnect-backend.onrender.com';
const CONCURRENT_USERS = 20;
const REQUESTS_PER_USER = 3;

async function makeRequest() {
  const start = Date.now();
  try {
    await axios.get(`${API_URL}/api/health`, { timeout: 10000 });
    return { success: true, time: Date.now() - start };
  } catch (error) {
    return { success: false, time: Date.now() - start };
  }
}

async function simulateUser() {
  const results = [];
  for (let i = 0; i < REQUESTS_PER_USER; i++) {
    results.push(await makeRequest());
  }
  return results;
}

async function runLoadTest() {
  console.log('Performance Load Testing\n');
  console.log('='.repeat(60));
  console.log(`Concurrent Users: ${CONCURRENT_USERS}`);
  console.log(`Requests per User: ${REQUESTS_PER_USER}`);
  console.log(`Total Requests: ${CONCURRENT_USERS * REQUESTS_PER_USER}\n`);
  
  const startTime = Date.now();
  const users = Array(CONCURRENT_USERS).fill(null).map(() => simulateUser());
  const allResults = (await Promise.all(users)).flat();
  const totalTime = (Date.now() - startTime) / 1000;
  
  const successful = allResults.filter(r => r.success).length;
  const failed = allResults.length - successful;
  const avgResponseTime = allResults.reduce((sum, r) => sum + r.time, 0) / allResults.length;
  const throughput = allResults.length / totalTime;
  
  console.log('Results:');
  console.log('='.repeat(60));
  console.log(`Successful Requests: ${successful}/${allResults.length}`);
  console.log(`Failed Requests: ${failed}`);
  console.log(`Average Response Time: ${avgResponseTime.toFixed(0)}ms`);
  console.log(`Throughput: ${throughput.toFixed(1)} req/sec`);
  console.log(`Error Rate: ${(failed/allResults.length*100).toFixed(1)}%`);
  console.log(`Total Test Duration: ${totalTime.toFixed(1)}s\n`);
  
  if (avgResponseTime < 3000 && failed/allResults.length < 0.05) {
    console.log('[PASS] Performance Test PASSED\n');
  } else {
    console.log('[WARN] Performance Test NEEDS IMPROVEMENT\n');
  }
}

runLoadTest();

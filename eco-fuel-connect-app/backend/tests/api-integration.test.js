const axios = require('axios');

const API_URL = process.env.API_URL || 'https://ecofuelconnect-backend.onrender.com/api';

const endpoints = [
  { method: 'GET', path: '/health', name: 'Health Check' },
  { method: 'GET', path: '/welcome-config', name: 'Welcome Config' },
  { method: 'GET', path: '/manifest.json', name: 'Manifest' },
];

async function testEndpoint(endpoint) {
  try {
    const config = { method: endpoint.method, url: `${API_URL}${endpoint.path}`, timeout: 5000 };
    const response = await axios(config);
    const success = response.status >= 200 && response.status < 300;
    return { ...endpoint, status: response.status, success };
  } catch (error) {
    const status = error.response?.status || 0;
    return { ...endpoint, status, success: false, error: error.message };
  }
}

async function runIntegrationTests() {
  console.log('API Integration Testing\n');
  console.log('='.repeat(60));
  
  const results = await Promise.all(endpoints.map(testEndpoint));
  
  const passed = results.filter(r => r.success).length;
  const total = results.length;
  
  console.log('Public Endpoints (Should Return 200):');
  results.forEach(r => {
    const icon = r.success ? '[PASS]' : '[FAIL]';
    const statusText = r.status === 0 ? 'TIMEOUT/ERROR' : r.status;
    console.log(`${icon} ${r.method.padEnd(6)} ${r.path.padEnd(35)} ${statusText}`);
  });
  
  console.log('='.repeat(60));
  console.log(`\nResults: ${passed}/${total} Endpoints Functional (${Math.round(passed/total*100)}%)`);
  console.log(`Success Rate: ${Math.round(passed/total*100)}%`);
  
  if (passed === total) {
    console.log('[PASS] All public endpoints working correctly\n');
  } else {
    console.log('[FAIL] Some endpoints are not responding\n');
  }
}

runIntegrationTests();

const axios = require('axios');

const API_URL = process.env.API_URL || 'https://ecofuelconnect-backend.onrender.com';

const publicEndpoints = [
  { method: 'GET', path: '/health', name: 'Health Check' },
  { method: 'GET', path: '/welcome-config', name: 'Welcome Config' },
];

const protectedEndpoints = [
  { method: 'GET', path: '/dashboard/stats', name: 'Dashboard Stats' },
  { method: 'GET', path: '/waste-logging', name: 'Waste Entries' },
  { method: 'GET', path: '/biogas-production', name: 'Production Data' },
  { method: 'GET', path: '/fuel-requests', name: 'Fuel Requests' },
  { method: 'GET', path: '/projects', name: 'Projects' },
  { method: 'GET', path: '/notifications', name: 'Notifications' },
];

async function testEndpoint(endpoint, expectAuth = false) {
  try {
    const config = { 
      method: endpoint.method, 
      url: `${API_URL}${endpoint.path}`, 
      timeout: 10000,
      validateStatus: () => true
    };
    const response = await axios(config);
    const success = expectAuth ? response.status === 401 : (response.status >= 200 && response.status < 300);
    return { ...endpoint, status: response.status, success, expected: expectAuth };
  } catch (error) {
    const status = error.response?.status || 0;
    const success = expectAuth && status === 401;
    return { ...endpoint, status, success, expected: expectAuth, error: error.code };
  }
}

async function runComprehensiveTests() {
  console.log('Comprehensive API Testing\n');
  console.log('='.repeat(70));
  
  console.log('\n[1] Public Endpoints (Should Return 200):\n');
  const publicResults = await Promise.all(publicEndpoints.map(e => testEndpoint(e, false)));
  publicResults.forEach(r => {
    const icon = r.success ? '[PASS]' : '[FAIL]';
    const statusText = r.status === 0 ? 'ERROR' : r.status;
    console.log(`${icon} ${r.method.padEnd(6)} ${r.path.padEnd(30)} ${statusText}`);
  });
  
  console.log('\n[2] Protected Endpoints (Should Return 401 Unauthorized):\n');
  const protectedResults = await Promise.all(protectedEndpoints.map(e => testEndpoint(e, true)));
  protectedResults.forEach(r => {
    const icon = r.success ? '[SECURED]' : '[FAIL]';
    const statusText = r.status === 0 ? 'ERROR' : r.status;
    const note = r.status === 401 ? '(Auth Working)' : '';
    console.log(`${icon} ${r.method.padEnd(6)} ${r.path.padEnd(30)} ${statusText} ${note}`);
  });
  
  const allResults = [...publicResults, ...protectedResults];
  const passed = allResults.filter(r => r.success).length;
  const total = allResults.length;
  
  console.log('\n' + '='.repeat(70));
  console.log(`\nTotal Results: ${passed}/${total} Tests Passed (${Math.round(passed/total*100)}%)`);
  console.log(`Public Endpoints: ${publicResults.filter(r => r.success).length}/${publicResults.length} Working`);
  console.log(`Protected Endpoints: ${protectedResults.filter(r => r.success).length}/${protectedResults.length} Secured`);
  
  if (passed === total) {
    console.log('\n[PASS] All API endpoints functioning correctly\n');
  } else {
    console.log('\n[WARN] Some endpoints need attention\n');
  }
}

runComprehensiveTests();

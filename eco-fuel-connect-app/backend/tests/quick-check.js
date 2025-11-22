const https = require('https');

const API_URL = 'https://ecofuelconnect-backend.onrender.com';

function testEndpoint(path) {
  return new Promise((resolve) => {
    const url = `${API_URL}${path}`;
    console.log(`Testing: ${url}`);
    
    https.get(url, { timeout: 10000 }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        console.log(`[${res.statusCode}] ${path}`);
        console.log(`Response: ${data.substring(0, 100)}...\n`);
        resolve({ status: res.statusCode, success: true });
      });
    }).on('error', (err) => {
      console.log(`[ERROR] ${path}: ${err.message}\n`);
      resolve({ status: 0, success: false });
    }).on('timeout', () => {
      console.log(`[TIMEOUT] ${path}\n`);
      resolve({ status: 0, success: false });
    });
  });
}

async function quickCheck() {
  console.log('Quick Backend Check\n');
  console.log('='.repeat(60));
  
  await testEndpoint('/api/health');
  await testEndpoint('/api/welcome-config');
  
  console.log('='.repeat(60));
  console.log('\nIf you see 200 status codes above, your backend is working!');
  console.log('If you see errors, check your Render deployment.\n');
}

quickCheck();

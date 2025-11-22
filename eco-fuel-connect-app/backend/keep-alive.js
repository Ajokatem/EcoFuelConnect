const axios = require('axios');

const BACKEND_URL = process.env.BACKEND_URL || 'https://eco-fuel-connect-app.onrender.com';
const PING_INTERVAL = 14 * 60 * 1000; // 14 minutes (Render free tier sleeps after 15 min)

async function pingServer() {
  try {
    const response = await axios.get(`${BACKEND_URL}/api/health`, { timeout: 10000 });
    console.log(`✅ Keep-alive ping successful at ${new Date().toISOString()}`);
    console.log(`   Status: ${response.data.status}`);
  } catch (error) {
    console.error(`❌ Keep-alive ping failed at ${new Date().toISOString()}`);
    console.error(`   Error: ${error.message}`);
  }
}

// Start keep-alive service
console.log('🚀 Starting keep-alive service...');
console.log(`   Target: ${BACKEND_URL}`);
console.log(`   Interval: ${PING_INTERVAL / 1000 / 60} minutes`);

// Initial ping
pingServer();

// Set up interval
setInterval(pingServer, PING_INTERVAL);

const axios = require('axios');
const { performance } = require('perf_hooks');

const BASE_URL = process.env.API_BASE_URL || 'http://localhost:5000';
const CONCURRENT_USERS = 50;
const TEST_DURATION = 60000; // 60 seconds

class LoadTester {
  constructor() {
    this.results = [];
    this.activeRequests = 0;
    this.totalRequests = 0;
    this.errors = 0;
  }

  async simulateUser(userId) {
    const userActions = [
      () => this.testHealthCheck(),
      () => this.testWelcomeConfig(),
      () => this.testManifest(),
      () => this.testNotifications(),
      () => this.testDashboard()
    ];

    const startTime = Date.now();
    while (Date.now() - startTime < TEST_DURATION) {
      const action = userActions[Math.floor(Math.random() * userActions.length)];
      await this.executeAction(action, userId);
      await this.randomDelay();
    }
  }

  async executeAction(action, userId) {
    const start = performance.now();
    this.activeRequests++;
    this.totalRequests++;

    try {
      await action();
      const duration = performance.now() - start;
      this.results.push({
        userId,
        duration,
        success: true,
        timestamp: Date.now()
      });
    } catch (error) {
      this.errors++;
      this.results.push({
        userId,
        duration: performance.now() - start,
        success: false,
        error: error.message,
        timestamp: Date.now()
      });
    } finally {
      this.activeRequests--;
    }
  }

  async testHealthCheck() {
    await axios.get(`${BASE_URL}/api/health`);
  }

  async testWelcomeConfig() {
    await axios.get(`${BASE_URL}/api/welcome-config`);
  }

  async testManifest() {
    await axios.get(`${BASE_URL}/manifest.json`);
  }

  async testNotifications() {
    await axios.get(`${BASE_URL}/api/notifications`);
  }

  async testDashboard() {
    await axios.get(`${BASE_URL}/api/dashboard`);
  }

  randomDelay() {
    return new Promise(resolve => setTimeout(resolve, Math.random() * 1000 + 200));
  }

  async runLoadTest() {
    console.log(`Starting load test with ${CONCURRENT_USERS} concurrent users...`);
    const startTime = Date.now();

    const userPromises = Array.from({ length: CONCURRENT_USERS }, (_, i) => 
      this.simulateUser(i + 1)
    );

    await Promise.all(userPromises);

    const endTime = Date.now();
    this.generateReport(endTime - startTime);
  }

  generateReport(totalTime) {
    const successfulRequests = this.results.filter(r => r.success);
    const avgResponseTime = successfulRequests.reduce((sum, r) => sum + r.duration, 0) / successfulRequests.length;

    console.log('\n=== LOAD TEST RESULTS ===');
    console.log(`Concurrent Users: ${CONCURRENT_USERS}`);
    console.log(`Total Requests: ${this.totalRequests}`);
    console.log(`Successful Requests: ${successfulRequests.length}`);
    console.log(`Failed Requests: ${this.errors}`);
    console.log(`Average Response Time: ${(avgResponseTime / 1000).toFixed(3)}s`);

    const avgSeconds = avgResponseTime / 1000;
    if (avgSeconds <= 3.0) {
      console.log(`✅ PASS: Average response time (${avgSeconds.toFixed(3)}s) is under 3 seconds`);
    } else {
      console.log(`❌ FAIL: Average response time (${avgSeconds.toFixed(3)}s) exceeds 3 seconds`);
    }

    if (this.errors === 0) {
      console.log('✅ PASS: No system crashes detected');
    }
  }
}

module.exports = LoadTester;
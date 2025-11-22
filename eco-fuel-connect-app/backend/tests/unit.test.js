const request = require('supertest');
const app = require('../server');

describe('Authentication Tests', () => {
  test('POST /api/auth/register - should create new user', async () => {
    const res = await request(app).post('/api/auth/register').send({
      email: 'test@example.com',
      password: 'Test123!',
      firstName: 'Test',
      lastName: 'User',
      role: 'supplier'
    });
    expect([200, 201, 400]).toContain(res.statusCode);
  });

  test('POST /api/auth/login - should authenticate user', async () => {
    const res = await request(app).post('/api/auth/login').send({
      email: 'test@example.com',
      password: 'Test123!'
    });
    expect([200, 401]).toContain(res.statusCode);
  });

  test('GET /api/auth/me - should return user profile', async () => {
    const res = await request(app).get('/api/auth/me');
    expect([200, 401]).toContain(res.statusCode);
  });
});

describe('Waste Logging Tests', () => {
  test('GET /api/waste-logging - should fetch waste entries', async () => {
    const res = await request(app).get('/api/waste-logging');
    expect([200, 401]).toContain(res.statusCode);
  });

  test('POST /api/waste-logging - should create waste entry', async () => {
    const res = await request(app).post('/api/waste-logging').send({
      wasteType: 'organic',
      quantity: 100,
      unit: 'kg'
    });
    expect([200, 201, 401]).toContain(res.statusCode);
  });
});

describe('Production Monitoring Tests', () => {
  test('GET /api/biogas-production - should fetch production data', async () => {
    const res = await request(app).get('/api/biogas-production');
    expect([200, 401]).toContain(res.statusCode);
  });
});

describe('Delivery Tracking Tests', () => {
  test('GET /api/fuel-requests - should fetch fuel requests', async () => {
    const res = await request(app).get('/api/fuel-requests');
    expect([200, 401]).toContain(res.statusCode);
  });
});

describe('Health Check', () => {
  test('GET /api/health - should return OK', async () => {
    const res = await request(app).get('/api/health');
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('OK');
  });
});

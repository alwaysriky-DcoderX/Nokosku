// e2e-test.js - End-to-End Testing NOKOSKU
const axios = require('axios');

async function e2eTest() {
  const baseURL = 'http://localhost:3000';

  try {
    // Register
    console.log('Testing Register...');
    const regRes = await axios.post(`${baseURL}/api/v1/auth/register`, {
      email: 'test@nokosku.com',
      password: 'test123',
      name: 'Test'
    });
    console.log('Register:', regRes.data.success ? 'PASS' : 'FAIL');

    // Login
    console.log('Testing Login...');
    const loginRes = await axios.post(`${baseURL}/api/v1/auth/login`, {
      email: 'test@nokosku.com',
      password: 'test123'
    });
    const token = loginRes.data.token;
    console.log('Login:', loginRes.data.success ? 'PASS' : 'FAIL');

    // Get Services
    console.log('Testing Get Services...');
    const servicesRes = await axios.get(`${baseURL}/api/v1/orders/services`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('Services:', servicesRes.data.success ? 'PASS' : 'FAIL');

    // Health Check
    console.log('Testing Health...');
    const healthRes = await axios.get(`${baseURL}/health`);
    console.log('Health:', healthRes.data.status === 'ok' ? 'PASS' : 'FAIL');

    console.log('E2E Testing Complete');
  } catch (e) {
    console.error('E2E Test Error:', e.message);
  }
}

e2eTest();
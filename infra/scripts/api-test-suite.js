// api-test-suite.js - NOKOSKU API Tests
const axios = require('axios');

async function testRumahOTP() {
  try {
    const res = await axios.get('https://www.rumahotp.com/api/v2/services', {
      headers: { 'x-apikey': process.env.RUMAHOTP_APIKEY, 'Accept': 'application/json' }
    });
    console.log('RumahOTP Services:', res.data.success ? 'OK' : 'FAIL');
  } catch (e) {
    console.log('RumahOTP FAIL:', e.message);
  }
}

async function testAtlantic() {
  try {
    const res = await axios.post('https://atlantich2h.com/deposit/create', {
      api_key: process.env.ATLANTIC_APIKEY,
      reff_id: 'TEST123',
      nominal: 5000,
      type: 'ewallet',
      metode: 'qris'
    }, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    });
    console.log('Atlantic Deposit:', res.data.status ? 'OK' : 'FAIL');
  } catch (e) {
    console.log('Atlantic FAIL:', e.message);
  }
}

async function testLocalAPI() {
  try {
    const res = await axios.get('http://localhost:3000/health');
    console.log('Local Health:', res.data.status === 'ok' ? 'OK' : 'FAIL');
  } catch (e) {
    console.log('Local API FAIL:', e.message);
  }
}

testRumahOTP();
testAtlantic();
testLocalAPI();
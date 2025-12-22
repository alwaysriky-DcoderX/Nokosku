// NOKOSKU Backend Starter
// Bahasa kode: English, komentar: Indonesia
const express = require('express');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const sequelize = require('../models/db'); // Import sequelize
const logger = require('../lib/logger'); // Import logger

const app = express();
const path = require('path');

app.use(helmet());
app.use(express.json());

// Serve static files
app.use('/assets', express.static(path.join(__dirname, '../../frontend/assets')));
app.use('/lottie', express.static(path.join(__dirname, '../../frontend/lottie')));
app.use('/js', express.static(path.join(__dirname, '../../frontend/js')));

// Serve frontend
app.get('/', (req, res) => res.sendFile('/var/www/Nokosku/frontend/pages/index.html'));
app.get('/admin.html', (req, res) => res.sendFile('/var/www/Nokosku/frontend/admin.html'));

// Sync DB
sequelize.sync({ force: false }).then(() => {
  console.log('DB synced');
}).catch(e => console.error('DB sync error:', e));

// Rate limit
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 menit
  max: 100, // 100 request per window
  message: 'Bentar ya, request terlalu banyak.'
});
app.use(limiter);

// Performance: Compression
const compression = require('compression');
app.use(compression());

// Health check
app.get('/health', (req, res) => {
  logger.info('Health check requested');
  const timestamp = new Date().toISOString();
  res.json({
    status: 'ok',
    timestamp,
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    version: '1.0.0'
  });
});

// Route auth
app.use('/api/v1/auth', require('../routes/auth'));
// Route profile
app.use('/api/v1/user/profile', require('../routes/profile'));
// Route deposit
app.use('/api/v1/deposit', require('../routes/deposit'));
// Route order
app.use('/api/v1/orders', require('../routes/order'));
// Route admin
app.use('/api/v1/admin', require('../routes/admin'));

module.exports = app;


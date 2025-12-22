// Router Auth NOKOSKU
const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/auth');

// Register
router.post('/register', AuthController.register);
// Login
router.post('/login', AuthController.login);

module.exports = router;

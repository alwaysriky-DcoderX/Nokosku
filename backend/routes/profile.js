// Router Profile NOKOSKU
const express = require('express');
const router = express.Router();
const { verifyToken } = require('../lib/auth');
const profileController = require('../controllers/profile');

router.get('/', verifyToken, profileController.getProfile);
router.put('/', verifyToken, profileController.updateProfile);
router.get('/balance', verifyToken, profileController.getBalance);
router.get('/transactions', verifyToken, profileController.getTransactions);
module.exports = router;

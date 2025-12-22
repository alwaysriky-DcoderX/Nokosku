// Router Order NOKOSKU
const express = require('express');
const router = express.Router();
const { verifyToken } = require('../lib/auth');
const orderController = require('../controllers/order');

router.get('/services', verifyToken, orderController.getServices);
router.get('/countries/:serviceId', verifyToken, orderController.getCountries);
router.get('/operators/:countryCode', verifyToken, orderController.getOperators);
router.post('/create', verifyToken, orderController.create);
router.get('/:id', verifyToken, orderController.status);
router.post('/:id/resend', verifyToken, orderController.resendOtp);
router.post('/:id/cancel', verifyToken, orderController.cancel);
router.get('/history', verifyToken, orderController.history);
// Endpoint lain: status, cancel, resend, dsb
module.exports = router;

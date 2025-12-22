// Router Deposit NOKOSKU
const express = require('express');
const router = express.Router();
const { verifyToken } = require('../lib/auth');
const depositController = require('../controllers/deposit');

router.post('/create', verifyToken, depositController.create);
router.get('/:id', verifyToken, depositController.status);
router.post('/:id/cancel', verifyToken, depositController.cancel);
router.get('/history', verifyToken, depositController.history);
module.exports = router;

// Router Admin NOKOSKU
const express = require('express');
const router = express.Router();
const { verifyToken } = require('../lib/auth');
const adminController = require('../controllers/admin');

// Middleware cek admin
function checkAdmin(req, res, next) {
  if (!req.user.is_admin) return res.status(403).json({ error: 'Akses ditolak.' });
  next();
}

router.use(verifyToken, checkAdmin);

// Routes
router.get('/stats', adminController.stats);
router.get('/users', adminController.users);
router.put('/users/:id', adminController.updateUser);
router.post('/refund', adminController.refund);
router.get('/audit', adminController.audit);
router.get('/markup', adminController.getMarkup);
router.post('/markup', adminController.setMarkup);
router.get('/profit-analytics', adminController.profitAnalytics);

module.exports = router;

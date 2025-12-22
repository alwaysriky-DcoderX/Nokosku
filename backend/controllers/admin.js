// Controller Admin NOKOSKU
const User = require('../models/user');
const Deposit = require('../models/deposit');
const Order = require('../models/order');
const Activity = require('../models/activity');
const MarkupRule = require('../models/markup');
const ProfitLog = require('../models/profit');

// Stats admin
exports.stats = async (req, res) => {
  try {
    const totalUsers = await User.count();
    const totalDeposits = await Deposit.sum('nominal');
    const totalOrders = await Order.count();
    const totalProfit = await ProfitLog.sum('markup') || 0;
    res.json({ success: true, stats: { totalUsers, totalDeposits, totalOrders, totalProfit } });
  } catch (e) {
    res.status(500).json({ error: 'Bentar ya, sistem lagi cek data.' });
  }
};

// Get users
exports.users = async (req, res) => {
  try {
    const users = await User.findAll();
    res.json({ success: true, users });
  } catch (e) {
    res.status(500).json({ error: 'Maaf, sistem error load user.' });
  }
};

// Update user (ban/unban)
exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { is_banned } = req.body;
    await User.update({ is_banned }, { where: { id } });
    res.json({ success: true, message: 'User updated.' });
  } catch (e) {
    res.status(500).json({ error: 'Bentar ya, sistem lagi update.' });
  }
};

// Refund manual
exports.refund = async (req, res) => {
  try {
    const { order_id } = req.body;
    const order = await Order.findByPk(order_id);
    if (!order || order.status !== 'expired') return res.status(400).json({ error: 'Order tidak bisa refund.' });
    const user = await User.findByPk(order.user_id);
    if (user) user.balance += order.price; // Asumsi harga order
    await user.save();
    await Activity.create({ user_id: order.user_id, event: 'order:refunded', detail: `Refund order ${order.id}, saldo bertambah.` });
    res.json({ success: true, message: 'Refund berhasil.' });
  } catch (e) {
    res.status(500).json({ error: 'Maaf, sistem error refund.' });
  }
};

// Audit log
exports.audit = async (req, res) => {
  try {
    const logs = await Activity.findAll({ limit: 100, order: [['created_at', 'DESC']] });
    res.json({ success: true, logs });
  } catch (e) {
    res.status(500).json({ error: 'Bentar ya, sistem lagi load log.' });
  }
};

// Get markup rules
exports.getMarkup = async (req, res) => {
  try {
    const rules = await MarkupRule.findAll();
    res.json({ success: true, rules });
  } catch (e) {
    res.status(500).json({ error: 'Maaf, sistem error markup.' });
  }
};

// Create/Update markup
exports.setMarkup = async (req, res) => {
  try {
    const { service, country, operator, markup } = req.body;
    await MarkupRule.upsert({ service, country, operator, markup });
    res.json({ success: true, message: 'Markup updated.' });
  } catch (e) {
    res.status(500).json({ error: 'Maaf, sistem error set markup.' });
  }
};

// Profit analytics
exports.profitAnalytics = async (req, res) => {
  try {
    const profits = await ProfitLog.findAll({ limit: 50, order: [['created_at', 'DESC']] });
    res.json({ success: true, profits });
  } catch (e) {
    res.status(500).json({ error: 'Maaf, sistem error profit.' });
  }
};

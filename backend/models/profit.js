// Model Profit Logs NOKOSKU
const { DataTypes } = require('sequelize');
const sequelize = require('./db');

const ProfitLog = sequelize.define('profit_log', {
  id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
  order_id: { type: DataTypes.BIGINT, allowNull: false },
  base_price: { type: DataTypes.BIGINT, allowNull: false },
  markup: { type: DataTypes.BIGINT, allowNull: false },
  fee: { type: DataTypes.BIGINT, defaultValue: 0 },
  selling_price: { type: DataTypes.BIGINT, allowNull: false },
  created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
}, {
  timestamps: false,
  tableName: 'profit_logs'
});

module.exports = ProfitLog;
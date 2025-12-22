// Model Transaction NOKOSKU
const { DataTypes } = require('sequelize');
const sequelize = require('./db');

const Transaction = sequelize.define('transaction', {
  id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
  user_id: { type: DataTypes.BIGINT, allowNull: false },
  type: { type: DataTypes.ENUM('deposit','order','refund','profit'), allowNull: false },
  related_id: { type: DataTypes.BIGINT },
  amount: { type: DataTypes.BIGINT, allowNull: false },
  profit: { type: DataTypes.BIGINT, defaultValue: 0 },
  created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
}, {
  timestamps: false,
  tableName: 'transactions'
});

module.exports = Transaction;
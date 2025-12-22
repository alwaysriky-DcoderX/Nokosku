// Model Markup Rules NOKOSKU
const { DataTypes } = require('sequelize');
const sequelize = require('./db');

const MarkupRule = sequelize.define('markup_rule', {
  id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
  service: { type: DataTypes.STRING },
  country: { type: DataTypes.STRING },
  operator: { type: DataTypes.STRING },
  markup: { type: DataTypes.BIGINT, defaultValue: 1000 },
  created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
}, {
  timestamps: false,
  tableName: 'markup_rules'
});

module.exports = MarkupRule;
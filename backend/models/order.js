// Model Order NOKOSKU
const { DataTypes } = require('sequelize');
const sequelize = require('./db');

const Order = sequelize.define('order', {
    id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
    provider_id: { type: DataTypes.STRING, allowNull: false },
    user_id: { type: DataTypes.BIGINT, allowNull: false },
    service: { type: DataTypes.STRING, allowNull: false },
    country: { type: DataTypes.STRING, allowNull: false },
    operator: { type: DataTypes.STRING },
    number: { type: DataTypes.STRING },
    status: { type: DataTypes.ENUM('pending','processing','otp_received','expired','cancel'), allowNull: false },
    otp_code: { type: DataTypes.STRING },
    otp_resend: { type: DataTypes.INTEGER, defaultValue: 0 },
    expired_at: { type: DataTypes.DATE },
    provider_response: { type: DataTypes.JSON },
    created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
}, {
    timestamps: false,
    tableName: 'orders'
});

module.exports = Order;

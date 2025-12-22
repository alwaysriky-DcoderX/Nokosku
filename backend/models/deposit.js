// Model Deposit NOKOSKU
const { DataTypes } = require('sequelize');
const sequelize = require('./db');

const Deposit = sequelize.define('deposit', {
    id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
uuid: { type: DataTypes.STRING, defaultValue: () => require('uuid').v4() },
    provider_id: { type: DataTypes.STRING, allowNull: false },
payment_method_id: { type: DataTypes.STRING, defaultValue: 'atlantic_qris' },
    user_id: { type: DataTypes.BIGINT, allowNull: false },
    nominal: { type: DataTypes.BIGINT, allowNull: false },
amount: { type: DataTypes.BIGINT, allowNull: false },
total_amount: { type: DataTypes.BIGINT, allowNull: false },
    metode: { type: DataTypes.STRING, allowNull: false },
    status: { type: DataTypes.ENUM('pending','processing','success','expired','cancel'), allowNull: false },
    expired_at: { type: DataTypes.DATE },
expires_at: { type: DataTypes.DATE },
    paid_at: { type: DataTypes.DATE },
    provider_response: { type: DataTypes.JSON },
    created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
updated_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
}, {
    timestamps: false,
    tableName: 'deposits'
});

module.exports = Deposit;

// Sequelize Model User NOKOSKU
const { DataTypes } = require('sequelize');
const sequelize = require('./db');

const User = sequelize.define('user', {
    id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
uuid: { type: DataTypes.STRING, defaultValue: () => require('uuid').v4() },
    email: { type: DataTypes.STRING, unique: true, allowNull: false },
    password: { type: DataTypes.STRING, allowNull: false },
    name: { type: DataTypes.STRING },
    balance: { type: DataTypes.BIGINT, defaultValue: 0 },
    is_admin: { type: DataTypes.BOOLEAN, defaultValue: false },
    is_banned: { type: DataTypes.BOOLEAN, defaultValue: false },
    created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
}, {
    timestamps: false,
    tableName: 'users'
});

module.exports = User;

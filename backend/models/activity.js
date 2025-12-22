// Model Activity Log NOKOSKU
const { DataTypes } = require('sequelize');
const sequelize = require('./db');

const Activity = sequelize.define('activity', {
    id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
    user_id: { type: DataTypes.BIGINT },
    event: { type: DataTypes.STRING },
    detail: { type: DataTypes.TEXT },
    created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
}, {
    timestamps: false,
    tableName: 'activity_logs'
});

module.exports = Activity;

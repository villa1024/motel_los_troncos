const { Sequelize } = require('sequelize');
const sequelize = require('../database/database');

const Estado = sequelize.define('estado', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    estado: {
        type: Sequelize.TEXT,
        
    }


}, {
    timestamps: false
});

module.exports = Estado;
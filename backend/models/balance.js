const { Sequelize } = require('sequelize');
const sequelize = require('../database/database');

const Balance = sequelize.define('balance', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    id_usuario: {
        type: Sequelize.INTEGER
    },
    caja_anterior: {
        type: Sequelize.INTEGER
    },
    ventas_total: {
        type: Sequelize.INTEGER
    },
    retiros_total: {
        type: Sequelize.INTEGER
    },
    gastos_total: {
        type: Sequelize.INTEGER
    },
    caja_final: {
        type: Sequelize.INTEGER
    },
    fecha: {
        type: Sequelize.DATE
    }
}, {
    timestamps: false
});

module.exports = Balance;
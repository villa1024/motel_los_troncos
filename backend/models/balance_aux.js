const { Sequelize } = require('sequelize');
const sequelize = require('../database/database');

const Balance_aux = sequelize.define('balance_aux', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true
    },
    ventas: {
        type: Sequelize.INTEGER
    },
    gastos: {
        type: Sequelize.INTEGER
    },
    retiros: {
        type: Sequelize.INTEGER
    },
    caja: {
        type: Sequelize.INTEGER
    },
    id_balance: {
        type: Sequelize.INTEGER
    }
}, {
    timestamps: false
});

module.exports = Balance_aux;
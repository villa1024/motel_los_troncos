const { Sequelize } = require('sequelize');
const sequelize = require('../database/database');

const Tipo_pago = sequelize.define('tipo_pago', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    tipo: {
        type: Sequelize.TEXT
    }

}, {
    timestamps: false
});

module.exports = Tipo_pago;
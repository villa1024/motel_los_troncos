const { Sequelize } = require('sequelize');
const sequelize = require('../database/database');

const Pedido = sequelize.define('pedido', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    id_tipo_pago: {
        type: Sequelize.INTEGER

    },
    estado: {
        type: Sequelize.TEXT

    },
    total: {
        type: Sequelize.INTEGER

    },
    id_servicio: {
        type: Sequelize.INTEGER
    }
}, {
    timestamps: false
});

module.exports = Pedido;
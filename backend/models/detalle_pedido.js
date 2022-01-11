const { Sequelize } = require('sequelize');
const sequelize = require('../database/database');

const Detalle_pedido = sequelize.define('detalle_pedido', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    cantidad: {
        type: Sequelize.INTEGER
    }
}, {
    timestamps: false
});

module.exports = Detalle_pedido;
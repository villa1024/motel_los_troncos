const { Sequelize } = require('sequelize');
const sequelize = require('../database/database');

const Inventario = sequelize.define('inventario', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    id_producto: {
        type: Sequelize.INTEGER,
        allowNull: false,
    },
    cantidad: {
        type: Sequelize.INTEGER
    },
    cantidad_minima: {
        type: Sequelize.INTEGER
    }
}, {
    timestamps: false
});

module.exports = Inventario;
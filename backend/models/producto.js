const { Sequelize } = require('sequelize');
const sequelize = require('../database/database');

const Producto = sequelize.define('productos', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    nombre: {
        type: Sequelize.TEXT
    },
    precio: {
        type: Sequelize.INTEGER
    },
    id_tipo: {
        type: Sequelize.INTEGER
    },


}, {
    timestamps: false
});

module.exports = Producto;
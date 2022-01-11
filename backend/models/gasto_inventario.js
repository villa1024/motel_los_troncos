const { Sequelize } = require('sequelize');
const sequelize = require('../database/database');

const Gasto_inventario = sequelize.define('gasto_inventario', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    id_usuario: {
        type: Sequelize.INTEGER
    },
    id_producto: {
        type: Sequelize.INTEGER
    },
    cantidad: {
        type: Sequelize.INTEGER
    }
    ,
    descripcion: {
        type: Sequelize.TEXT
    },
    fecha: {
        type: Sequelize.DATE
    },

}, {
    timestamps: false
});

module.exports = Gasto_inventario;
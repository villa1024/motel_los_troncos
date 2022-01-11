const { Sequelize } = require('sequelize');
const sequelize = require('../database/database');

const Gasto_caja = sequelize.define('gasto_caja', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    id_usuario: {
        type: Sequelize.INTEGER
    },
    monto: {
        type: Sequelize.INTEGER
    },
    descripcion: {
        type: Sequelize.TEXT
    }
    ,
    fecha: {
        type: Sequelize.DATE
    }

}, {
    timestamps: false
});

module.exports = Gasto_caja;
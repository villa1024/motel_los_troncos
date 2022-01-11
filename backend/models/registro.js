const { Sequelize } = require('sequelize');
const sequelize = require('../database/database');

const Registro = sequelize.define('registro', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    id_usuario: {
        type: Sequelize.INTEGER
    },
    id_servicio: {
        type: Sequelize.INTEGER
    },
    id_habitacion: {
        type: Sequelize.INTEGER
    },
    fecha: {
        type: Sequelize.DATE
    },
    fecha_entrada: {
        type: Sequelize.DATE
    },
    monto: {
        type: Sequelize.INTEGER
    },
    observacion: {
        type: Sequelize.TEXT
    },
}, {
    timestamps: false
});

module.exports = Registro;
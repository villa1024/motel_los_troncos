const { Sequelize } = require('sequelize');
const sequelize = require('../database/database');

const Servicio = sequelize.define('servicios', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    id_habitacion: {
        type: Sequelize.INTEGER
    },
    id_usuario: {
        type: Sequelize.INTEGER
    },
    id_turno: {
        type: Sequelize.INTEGER
    },
    fecha: {
        type: Sequelize.DATE
    },
    hr_entrada: {
        type: Sequelize.TIME
    },
    hr_salida: {
        type: Sequelize.TIME
    },
    total: {
        type: Sequelize.INTEGER
    },
    id_cliente1: {
        type: Sequelize.INTEGER
    },
    id_cliente2: {
        type: Sequelize.INTEGER
    },
    estado: {
        type: Sequelize.STRING
    }
}, {
    timestamps: false
});

module.exports = Servicio;
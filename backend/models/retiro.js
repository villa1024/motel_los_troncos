const { Sequelize } = require('sequelize');
const sequelize = require('../database/database');

const Retiro = sequelize.define('retiros', {
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
        type: Sequelize.TEXT
    },
    descripcion: {
        type: Sequelize.TEXT
    },
    fecha: {
        type: Sequelize.DATE
    }

}, {

    timestamps: false
});

module.exports = Retiro;
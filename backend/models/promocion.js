const { Sequelize } = require('sequelize');
const sequelize = require('../database/database');

const Promocion = sequelize.define('promociones', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    horas: {
        type: Sequelize.INTEGER
    },
    precio: {
        type: Sequelize.INTEGER
    },
    bebida: {
        type: Sequelize.BOOLEAN
    },
    trago: {
        type: Sequelize.BOOLEAN
    },
    descripcion: {
        type: Sequelize.TEXT
    }
}, {
    timestamps: false
});

module.exports = Promocion;
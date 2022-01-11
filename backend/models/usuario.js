const { Sequelize } = require('sequelize');
const sequelize = require('../database/database');

const Usuario = sequelize.define('usuarios', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    nombre: {
        type: Sequelize.TEXT
    },
    apellido: {
        type: Sequelize.TEXT
    },
    rut: {
        type: Sequelize.TEXT
    },
    correo: {
        type: Sequelize.TEXT
    },
    telefono: {
        type: Sequelize.TEXT
    },
    direccion: {
        type: Sequelize.TEXT
    },
    
    password: {
        type: Sequelize.TEXT
    },
    estado: {
        type: Sequelize.BOOLEAN
    }

}, {
    timestamps: false
});

module.exports = Usuario;
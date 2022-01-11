const { Sequelize } = require('sequelize');
const sequelize = require('../database/database');

const Rol_usuario = sequelize.define('rol_usuario', {
    usuarioId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true
    },
    rolId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true
    }
}, {

    timestamps: false
});

module.exports = Rol_usuario; 
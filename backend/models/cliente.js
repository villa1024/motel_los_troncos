const { Sequelize } = require('sequelize');
const sequelize = require('../database/database');

const Cliente = sequelize.define('clientes', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    nombre: {
        type: Sequelize.TEXT,
        
    },
    apellido:{
        type: Sequelize.TEXT
    },
    rut:{
        type: Sequelize.TEXT
    },


}, {
    timestamps: false
});

module.exports = Cliente;
const { Sequelize } = require('sequelize');
const sequelize = require('../database/database');

const Habitacion = sequelize.define('habitaciones', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    numero: {
        type: Sequelize.INTEGER,
         
    },
    id_tipo: {
        type: Sequelize.INTEGER,
       
    },
    id_estado: {
        type: Sequelize.INTEGER,
         
    },
    descripcion: {
        type: Sequelize.TEXT,
      
    },


}, {
    timestamps: false
});

module.exports = Habitacion;
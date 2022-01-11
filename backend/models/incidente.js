const { Sequelize } = require('sequelize');
const sequelize = require('../database/database');

const Incidente = sequelize.define('incidentes', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    id_servicio: {
        type: Sequelize.INTEGER,
        allowNull: false,

        
    }


}, {
    timestamps: false
});

module.exports = Incidente;
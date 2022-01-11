const { Sequelize } = require('sequelize');
const sequelize = require('../database/database');

const Bodega = sequelize.define('bodega', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    id_producto: {
        type: Sequelize.INTEGER,
        
    },
    cantidad:{
        type: Sequelize.INTEGER
    },
    cantidad_minima:{
        type: Sequelize.INTEGER
    },


}, {
    timestamps: false
});

module.exports = Bodega;
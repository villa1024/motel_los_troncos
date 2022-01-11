const { Sequelize } = require('sequelize');
const sequelize = require('../database/database');

const Lista_negra = sequelize.define('lista_negra', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    id_cliente: {
        type: Sequelize.INTEGER,
        
    }
}, {
    timestamps: false
});

module.exports = Lista_negra;
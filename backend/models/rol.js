const { Sequelize } = require('sequelize');
const sequelize = require('../database/database');

const Roles = sequelize.define('roles', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    rol: {
        type: Sequelize.TEXT
    }
}, {

    timestamps: false
});

module.exports = Roles;
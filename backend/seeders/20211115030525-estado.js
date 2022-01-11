'use strict';
const sequelize = require('../database/database');

module.exports = {
    up: async (queryInterface, Sequelize) => {
        /**
         * Add seed commands here.
         *
         * Example:
         * await queryInterface.bulkInsert('People', [{
         *   name: 'John Doe',
         *   isBetaMember: false
         * }], {});
        */
        await queryInterface.bulkInsert('estado', [
            {
                id: 1,
                estado: 'Disponible'
            },
            {
                id: 2,
                estado: 'Ocupada'
            },
            {
                id: 3,
                estado: 'Aseo'
            },
            {
                id: 4,
                estado: 'Mantenimiento'
            }


        ], {});

        await sequelize.query('ALTER SEQUENCE estado_id_seq RESTART WITH 5;')
    },

    down: async (queryInterface, Sequelize) => {
        /**
         * Add commands to revert seed here.
         *
         * Example:
         * await queryInterface.bulkDelete('People', null, {});
         */
        await queryInterface.bulkDelete('estado');
    }
};

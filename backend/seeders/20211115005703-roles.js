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

        await queryInterface.bulkInsert('roles', [
            {
                id: 1,
                rol: 'Administrador',
            },
            {
                id: 2,
                rol: 'Cajero',
            },
            {
                id: 3,
                rol: 'Camarera',
            },
        ], {});
        await sequelize.query('ALTER SEQUENCE roles_id_seq RESTART WITH 4;')
    },

    down: async (queryInterface, Sequelize) => {
        /**
         * Add commands to revert seed here.
         *
         * Example:
         * await queryInterface.bulkDelete('People', null, {});
         */
        await queryInterface.bulkDelete('roles', null, {});
    }
};

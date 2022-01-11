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
        await queryInterface.bulkInsert('tipo_habitacion', [
            {
                id: 1,
                tipo: 'Jacuzzi'
            },
            {
                id: 2,
                tipo: 'Normal'

            }


        ], {});

        await sequelize.query('ALTER SEQUENCE tipo_habitacion_id_seq RESTART WITH 3;')
    },

    down: async (queryInterface, Sequelize) => {
        /**
         * Add commands to revert seed here.
         *
         * Example:
         * await queryInterface.bulkDelete('People', null, {});
         */
        await queryInterface.bulkDelete('tipo_habitacion', null, {});
    }
};

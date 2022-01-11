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
        await queryInterface.bulkInsert('habitaciones', [
            {
                id: 1,
                numero: 1,
                id_tipo: 1,
                id_estado: 1
            },
            {
                id: 2,
                numero: 2,
                id_tipo: 1,
                id_estado: 1
            },
            {
                id: 3,
                numero: 3,
                id_tipo: 1,
                id_estado: 1
            },
            {
                id: 4,
                numero: 4,
                id_tipo: 1,
                id_estado: 1
            },
            {
                id: 5,
                numero: 5,
                id_tipo: 2,
                id_estado: 1
            },
            {
                id: 6,
                numero: 6,
                id_tipo: 2,
                id_estado: 1
            },
            {
                id: 7,
                numero: 7,
                id_tipo: 2,
                id_estado: 1
            },
            {
                id: 8,
                numero: 8,
                id_tipo: 2,
                id_estado: 1
            },
            {
                id: 9,
                numero: 9,
                id_tipo: 2,
                id_estado: 1
            },
            {
                id: 10,
                numero: 10,
                id_tipo: 2,
                id_estado: 1
            },
            {
                id: 11,
                numero: 11,
                id_tipo: 1,
                id_estado: 1
            },
            {
                id: 12,
                numero: 12,
                id_tipo: 2,
                id_estado: 1
            },
            {
                id: 13,
                numero: 13,
                id_tipo: 2,
                id_estado: 1
            },
            {
                id: 14,
                numero: 14,
                id_tipo: 2,
                id_estado: 1
            },
            {
                id: 15,
                numero: 15,
                id_tipo: 2,
                id_estado: 1
            },
            {
                id: 16,
                numero: 16,
                id_tipo: 2,
                id_estado: 1
            },
            {
                id: 17,
                numero: 17,
                id_tipo: 2,
                id_estado: 1
            },
            {
                id: 18,
                numero: 18,
                id_tipo: 2,
                id_estado: 1
            },
            {
                id: 19,
                numero: 19,
                id_tipo: 2,
                id_estado: 1
            },
            {
                id: 20,
                numero: 20,
                id_tipo: 2,
                id_estado: 1
            },
            {
                id: 21,
                numero: 21,
                id_tipo: 2,
                id_estado: 1
            }

        ], {});

        await sequelize.query('ALTER SEQUENCE habitaciones_id_seq RESTART WITH 22;')
    },

    down: async (queryInterface, Sequelize) => {
        /**
         * Add commands to revert seed here.
         *
         * Example:
         * await queryInterface.bulkDelete('People', null, {});
         */
        await queryInterface.bulkDelete('habitaciones');
    }
};
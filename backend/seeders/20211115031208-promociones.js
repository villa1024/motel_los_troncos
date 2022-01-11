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
        await queryInterface.bulkInsert('promociones', [
            {
                id: 1,
                horas: 2,
                precio: 12800,
                bebida: false,
                trago: false,
                descripcion: 'Esta promoción no incluye nada'
            },
            {
                id: 2,
                horas: 3,
                precio: 16000,
                bebida: true,
                trago: false,
                descripcion: 'Esta promoción include bebidas'
            },
            {
                id: 3,
                horas: 6,
                precio: 19800,
                bebida: true,
                trago: true,
                descripcion: 'Esta promoción include bebidas y/o tragos. 6 Horas'
            },
            {
                id: 4,
                horas: 10,
                precio: 26900,
                bebida: true,
                trago: true,
                descripcion: 'Esta promoción include bebidas y/o tragos. 10 Horas'
            }


        ], {});

        await sequelize.query('ALTER SEQUENCE promociones_id_seq RESTART WITH 5;')
    },

    down: async (queryInterface, Sequelize) => {
        /**
         * Add commands to revert seed here.
         *
         * Example:
         * await queryInterface.bulkDelete('People', null, {});
         */
        await queryInterface.bulkDelete('promociones');
    }
};
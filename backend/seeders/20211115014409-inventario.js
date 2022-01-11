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
        await queryInterface.bulkInsert('inventario', [
            {
                id: 1,
                id_producto: 1,
                cantidad: 45,
                cantidad_minima: 24
            },
            {
                id: 2,
                id_producto: 2,
                cantidad: 45,
                cantidad_minima: 24
            },
            {
                id: 3,
                id_producto: 3,
                cantidad: 45,
                cantidad_minima: 24
            },
            {
                id: 4,
                id_producto: 4,
                cantidad: 45,
                cantidad_minima: 24
            },
            {
                id: 5,
                id_producto: 5,
                cantidad: 45,
                cantidad_minima: 24
            },
            {
                id: 6,
                id_producto: 6,
                cantidad: 45,
                cantidad_minima: 24
            },
            {
                id: 7,
                id_producto: 7,
                cantidad: 45,
                cantidad_minima: 24
            },
            {
                id: 8,
                id_producto: 8,
                cantidad: 45,
                cantidad_minima: 24
            },
            {
                id: 9,
                id_producto: 9,
                cantidad: 45,
                cantidad_minima: 24
            },
            {
                id: 10,
                id_producto: 10,
                cantidad: 45,
                cantidad_minima: 24
            },
            {
                id: 11,
                id_producto: 11,
                cantidad: 45,
                cantidad_minima: 24
            },
            {
                id: 12,
                id_producto: 12,
                cantidad: 45,
                cantidad_minima: 24
            },
            {
                id: 13,
                id_producto: 13,
                cantidad: 45,
                cantidad_minima: 24
            },
            {
                id: 14,
                id_producto: 14,
                cantidad: 45,
                cantidad_minima: 24
            },
            {
                id: 15,
                id_producto: 15,
                cantidad: 45,
                cantidad_minima: 24
            },
            {
                id: 16,
                id_producto: 16,
                cantidad: 45,
                cantidad_minima: 24
            },
            {
                id: 17,
                id_producto: 17,
                cantidad: 45,
                cantidad_minima: 24
            },
            {
                id: 18,
                id_producto: 18,
                cantidad: 45,
                cantidad_minima: 24
            },
            {
                id: 19,
                id_producto: 19,
                cantidad: 45,
                cantidad_minima: 24
            },
            {
                id: 20,
                id_producto: 20,
                cantidad: 45,
                cantidad_minima: 24
            },
            {
                id: 21,
                id_producto: 21,
                cantidad: 45,
                cantidad_minima: 24
            },
            {
                id: 22,
                id_producto: 22,
                cantidad: 45,
                cantidad_minima: 24
            },
            {
                id: 23,
                id_producto: 23,
                cantidad: 45,
                cantidad_minima: 24
            },
            {
                id: 24,
                id_producto: 24,
                cantidad: 45,
                cantidad_minima: 24
            },
            {
                id: 25,
                id_producto: 25,
                cantidad: 45,
                cantidad_minima: 24
            },
            {
                id: 26,
                id_producto: 26,
                cantidad: 5,
                cantidad_minima: 2
            },
            {
                id: 27,
                id_producto: 27,
                cantidad: 5,
                cantidad_minima: 2
            },

        ], {});
        await sequelize.query('ALTER SEQUENCE inventario_id_seq RESTART WITH 28;')
    },

    down: async (queryInterface, Sequelize) => {
        /**
         * Add commands to revert seed here.
         *
         * Example:
         * await queryInterface.bulkDelete('People', null, {});
         */
        await queryInterface.bulkDelete('inventario', null, {});
    }
};

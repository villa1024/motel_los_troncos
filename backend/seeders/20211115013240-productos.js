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
        await queryInterface.bulkInsert('productos', [
            {
                id: 1,
                nombre: 'Coca-cola',
                precio: 2200,
                id_tipo: 2
            },
            {
                id: 2,
                nombre: 'Fanta',
                precio: 2200,
                id_tipo: 2
            },
            {
                id: 3,
                nombre: 'Sprite',
                precio: 2200,
                id_tipo: 2
            },
            {
                id: 4,
                nombre: 'Kem',
                precio: 2200,
                id_tipo: 2
            },
            {
                id: 5,
                nombre: 'Agua mineral c/Gas',
                precio: 1500,
                id_tipo: 2
            },
            {
                id: 6,
                nombre: 'Agua mineral s/Gas',
                precio: 1500,
                id_tipo: 2
            },
            {
                id: 7,
                nombre: 'Te',
                precio: 500,
                id_tipo: 2
            },
            {
                id: 8,
                nombre: 'Café',
                precio: 500,
                id_tipo: 2
            },
            {
                id: 9,
                nombre: 'Churrasco',
                precio: 4500,
                id_tipo: 3
            },
            {
                id: 10,
                nombre: 'Papas Frita',
                precio: 4500,
                id_tipo: 3
            },
            {
                id: 11,
                nombre: 'Galleta',
                precio: 1000,
                id_tipo: 3
            },
            {
                id: 12,
                nombre: 'Pisco',
                precio: 4500,
                id_tipo: 1
            },
            {
                id: 13,
                nombre: 'Sour',
                precio: 4500,
                id_tipo: 1
            },
            {
                id: 14,
                nombre: 'Ron',
                precio: 4500,
                id_tipo: 1
            },
            {
                id: 15,
                nombre: 'whiskey',
                precio: 4500,
                id_tipo: 1
            },
            {
                id: 16,
                nombre: 'Gin c/Gin',
                precio: 4500,
                id_tipo: 1
            },
            {
                id: 17,
                nombre: 'Primavera',
                precio: 4500,
                id_tipo: 1
            },
            {
                id: 18,
                nombre: 'Martini',
                precio: 4500,
                id_tipo: 1
            },
            {
                id: 19,
                nombre: 'Sabanas',
                precio: 0,
                id_tipo: 4
            },
            {
                id: 20,
                nombre: 'Toalla',
                precio: 0,
                id_tipo: 4
            },
            {
                id: 21,
                nombre: 'Guantes',
                precio: 0,
                id_tipo: 5
            },
            {
                id: 22,
                nombre: 'Bolsa de basura',
                precio: 0,
                id_tipo: 5
            },
            {
                id: 23,
                nombre: 'Preservativos',
                precio: 700,
                id_tipo: 6
            },
            {
                id: 24,
                nombre: 'Shampoo',
                precio: 700,
                id_tipo: 6
            },
            {
                id: 25,
                nombre: 'Balsamo',
                precio: 700,
                id_tipo: 6
            },
            {
                id: 26,
                nombre: 'Peineta',
                precio: 1500,
                id_tipo: 6
            },
            {
                id: 27,
                nombre: 'Chicle',
                precio: 500,
                id_tipo: 6
            },

        ], {});

        await sequelize.query('ALTER SEQUENCE productos_id_seq RESTART WITH 28;')
    },

    down: async (queryInterface, Sequelize) => {
        /**
         * Add commands to revert seed here.
         *
         * Example:
         * await queryInterface.bulkDelete('People', null, {});
         */
        await queryInterface.bulkDelete('productos', null, {});
    }
};

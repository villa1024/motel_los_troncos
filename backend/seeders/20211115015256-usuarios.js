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
        await queryInterface.bulkInsert('usuarios', [
            {
                id: 1,
                nombre: 'Pedro',
                apellido: 'Engel',
                rut: '11111111-1',
                correo: 'pedro@engel.com',
                telefono: 9736478223,
                direccion: 'av Matta #4356',
                password: '$2a$10$CCJPhr5QdbmKghbP9ci/l.MWMMtkjntrlaFX9Ldigv28WKl0BofYK',
                estado: true
            },
            {
                id: 2,
                nombre: 'Juan',
                apellido: 'Perez',
                rut: '22222222-2',
                correo: 'pedro@perez.com',
                telefono: 9736478223,
                direccion: 'Las condes #4356',
                password: '$2a$10$CCJPhr5QdbmKghbP9ci/l.MWMMtkjntrlaFX9Ldigv28WKl0BofYK',
                estado: true
            },
            {
                id: 3,
                nombre: 'Roberto',
                apellido: 'Peña',
                rut: '33333333-3',
                correo: 'pedro@engel.com',
                telefono: 9736478223,
                direccion: 'Av lo Ovalle Lo espejo #3453',
                password: '$2a$10$CCJPhr5QdbmKghbP9ci/l.MWMMtkjntrlaFX9Ldigv28WKl0BofYK',
                estado: true
            },
            {
                id: 4,
                nombre: 'Juan',
                apellido: 'Muñoz',
                rut: '44444444-4',
                correo: 'Juan@munoz.com',
                telefono: 943587456,
                direccion: 'av San Diego ',
                password: '$2a$10$CCJPhr5QdbmKghbP9ci/l.MWMMtkjntrlaFX9Ldigv28WKl0BofYK',
                estado: true
            },

        ], {});
        await queryInterface.bulkInsert('rol_usuario', [
            {
                usuarioId: 1,
                rolId: 1
            },
            {
                usuarioId: 2,
                rolId: 2
            },
            {
                usuarioId: 3,
                rolId: 3
            },
            {
                usuarioId: 4,
                rolId: 1
            },
            {
                usuarioId: 4,
                rolId: 2
            }



        ], {});

        await sequelize.query('ALTER SEQUENCE usuarios_id_seq RESTART WITH 5;')
    },

    down: async (queryInterface, Sequelize) => {
        /**
         * Add commands to revert seed here.
         *
         * Example:
         * await queryInterface.bulkDelete('People', null, {});
         */
        await queryInterface.bulkDelete('rol_usuario');
        await queryInterface.bulkDelete('usuarios');

    }
};

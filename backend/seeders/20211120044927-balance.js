"use strict";
const sequelize = require("../database/database");

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
        await queryInterface.bulkInsert(
            "balance",
            [
                {
                    id: 1,
                    id_usuario: 1,
                    caja_anterior: 0,
                    ventas_total: 0,
                    retiros_total: 0,
                    gastos_total: 0,
                    caja_final: 0,
                    fecha: "2021-01-01 21:00:00-03",
                },
                {
                    id: 2,
                    id_usuario: 1,
                    caja_anterior: 0,
                    ventas_total: 0,
                    retiros_total: 0,
                    gastos_total: 0,
                    caja_final: 0,
                    fecha: "2021-01-02 21:00:00-03",
                },
                {
                    id: 3,
                    id_usuario: 1,
                    caja_anterior: 50000,
                    ventas_total: 500000,
                    retiros_total: 400000,
                    gastos_total: 100000,
                    caja_final: 50000,
                    fecha: "2021-01-03 21:00:00-03",
                },
                {
                    id: 4,
                    id_usuario: 1,
                    caja_anterior: 50000,
                    ventas_total: 500000,
                    retiros_total: 400000,
                    gastos_total: 100000,
                    caja_final: 50000,
                    fecha: "2021-02-01 21:00:00-03",
                },
                {
                    id: 5,
                    id_usuario: 1,
                    caja_anterior: 50000,
                    ventas_total: 500000,
                    retiros_total: 400000,
                    gastos_total: 100000,
                    caja_final: 50000,
                    fecha: "2021-03-01 21:00:00-03",
                },
                {
                    id: 6,
                    id_usuario: 1,
                    caja_anterior: 50000,
                    ventas_total: 500000,
                    retiros_total: 400000,
                    gastos_total: 100000,
                    caja_final: 50000,
                    fecha: "2021-03-01 21:00:00-03",
                },
                {
                    id: 7,
                    id_usuario: 1,
                    caja_anterior: 50000,
                    ventas_total: 500000,
                    retiros_total: 400000,
                    gastos_total: 100000,
                    caja_final: 50000,
                    fecha: "2021-04-01 21:00:00-03",
                },
                {
                    id: 8,
                    id_usuario: 1,
                    caja_anterior: 50000,
                    ventas_total: 500000,
                    retiros_total: 400000,
                    gastos_total: 100000,
                    caja_final: 50000,
                    fecha: "2021-05-01 21:00:00-03",
                },
                {
                    id: 9,
                    id_usuario: 1,
                    caja_anterior: 50000,
                    ventas_total: 500000,
                    retiros_total: 400000,
                    gastos_total: 100000,
                    caja_final: 50000,
                    fecha: "2021-05-01 21:00:00-03",
                },
                {
                    id: 10,
                    id_usuario: 1,
                    caja_anterior: 50000,
                    ventas_total: 500000,
                    retiros_total: 400000,
                    gastos_total: 100000,
                    caja_final: 50000,
                    fecha: "2021-06-01 21:00:00-03",
                },
                {
                    id: 11,
                    id_usuario: 1,
                    caja_anterior: 50000,
                    ventas_total: 500000,
                    retiros_total: 200000,
                    gastos_total: 300000,
                    caja_final: 50000,
                    fecha: "2021-07-01 21:00:00-03",
                },
                {
                    id: 12,
                    id_usuario: 1,
                    caja_anterior: 50000,
                    ventas_total: 500000,
                    retiros_total: 400000,
                    gastos_total: 100000,
                    caja_final: 50000,
                    fecha: "2021-08-01 21:00:00-03",
                },
                {
                    id: 13,
                    id_usuario: 1,
                    caja_anterior: 50000,
                    ventas_total: 500000,
                    retiros_total: 400000,
                    gastos_total: 100000,
                    caja_final: 50000,
                    fecha: "2021-08-01 21:00:00-03",
                },
                {
                    id: 14,
                    id_usuario: 1,
                    caja_anterior: 50000,
                    ventas_total: 500000,
                    retiros_total: 400000,
                    gastos_total: 100000,
                    caja_final: 50000,
                    fecha: "2021-09-01 21:00:00-03",
                },
                {
                    id: 15,
                    id_usuario: 1,
                    caja_anterior: 50000,
                    ventas_total: 500000,
                    retiros_total: 400000,
                    gastos_total: 100000,
                    caja_final: 50000,
                    fecha: "2021-10-01 21:00:00-03",
                },
                {
                    id: 16,
                    id_usuario: 1,
                    caja_anterior: 50000,
                    ventas_total: 500000,
                    retiros_total: 400000,
                    gastos_total: 100000,
                    caja_final: 50000,
                    fecha: "2021-11-01 21:00:00-03",
                },
                {
                    id: 17,
                    id_usuario: 1,
                    caja_anterior: 50000,
                    ventas_total: 600000,
                    retiros_total: 300000,
                    gastos_total: 300000,
                    caja_final: 50000,
                    fecha: "2021-12-01 21:00:00-03",
                },
                {
                    id: 18,
                    id_usuario: 1,
                    caja_anterior: 50000,
                    ventas_total: 600000,
                    retiros_total: 300000,
                    gastos_total: 300000,
                    caja_final: 50000,
                    fecha: "2021-12-2 21:00:00-03",
                },
                {
                    id: 19,
                    id_usuario: null,
                    caja_anterior: 50000,
                    ventas_total: null,
                    retiros_total: null,
                    gastos_total: null,
                    caja_final: null,
                    fecha: null,
                },
            ],
            {}
        );

        await sequelize.query('ALTER SEQUENCE balance_id_seq RESTART WITH 20;');
    },

    down: async (queryInterface, Sequelize) => {
        /**
         * Add commands to revert seed here.
         *
         * Example:
         * await queryInterface.bulkDelete('People', null, {});
         */
        await queryInterface.bulkDelete("balance");
    },
};

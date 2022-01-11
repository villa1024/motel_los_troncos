const { response } = require("express");
const sequelize = require("../database/database");

// Modelos
const Tipo_habitacion = require('../models/tipo_habitacion');
const Cliente = require("../models/cliente");
const Habitacion = require("../models/habitaciones");
const Estado = require("../models/estado");
const Pedido = require("../models/pedido");
const Promocion = require("../models/promocion");
const Servicio = require("../models/servicio");
const Servicio_promocion = require("../models/servicio_promociones");
const Detalle_pedido = require("../models/detalle_pedido");
const Servicio_promociones = require("../models/servicio_promociones");
const Inventario = require("../models/inventario");
const Producto = require("../models/producto");
const Balance_aux = require("../models/balance_aux");
const Registro = require("../models/registro");

// Helpers
const cantidad_extras = require('../helpers/cantidad_extras');
const descInv = require("../helpers/desc-inv");
const addInv = require("../helpers/add-inv");

// habitaciones disponibles
// habitaciones ocupadas
// habitaciones en aseo

const estadoHabitaciones = async (req, res) => {
    try {
        const disponibles = await Habitacion.findAll({
            where: {
                id_estado: 1
            },
        });
        const ocupadas = await Habitacion.findAll({
            where: {
                id_estado: 2
            },
        });
        const aseo = await Habitacion.findAll({
            where: {
                id_estado: 3
            },
        });

        const disponible = await disponibles.length;
        const ocupada = await ocupadas.length;
        const asear = await aseo.length;
        return res.json({
            ok: true,
            msg: {
                disponibles: disponible,
                ocupadas: ocupada,
                aseo: asear,
            },
        });
    } catch (error) {
        res.json({
            ok: false,
            msg: "No se pudo actualizar el cliente",
        });
    }
};

const pendientePago = async (req, res) => {
    try {
        const servicioPendiente = await Servicio_promocion.findAll({
            where: {
                estado: "pendiente",
            },
            attributes: ["id", "id_servicio", "estado"],
        });
        const pedidoPendiente = await Pedido.findAll({
            where: {
                estado: "pendiente",
            },
            attributes: ["id", "id_servicio", "estado"],
        });

        if (servicioPendiente || pedidoPendiente) {
            res.json({
                ok: true,
                msg: { servicioPendiente, pedidoPendiente },
            });
        } else {
            res.json({
                ok: true,
                msg: "empty",
            });
        }
    }
    catch (e) {
        res.json({
            ok: false,
            msg: 'Ha ocurrido un error, por favor contacte al administrador'
        });
    }
};

const listarHabitaciones = async (req, res) => {
    try {
        const habitaciones = await Habitacion.findAll({
            attributes: [
                'numero'
            ],
            include: [{
                model: Estado,
                attributes: [
                    'id'
                ],
            }, {
                model: Tipo_habitacion,
                attributes: [
                    'id'
                ]
            }, {
                model: Servicio
            }],
            order: [
                ['numero', 'ASC']
            ]
        });
        let array_final = [];
        for await (let habitacion of habitaciones) {
            const { servicios } = habitacion;
            if (servicios.length > 0) {
                for await (let servicio of servicios) {
                    if (servicio.estado === 'Pendiente') {
                        habitacion.servicios = servicio;
                        array_final.push(habitacion);
                        break;
                    }
                    else {
                        habitacion.servicios = [];
                        array_final.push(habitacion);
                        break;
                    }
                }
            }
            else {
                array_final.push(habitacion);
            }
            // let id_servicio = habitacion.servicios[0]?.id
            // // Comprobamos si esta pagado dicho servicio
            // if (id_servicio) {
            //     console.log(id_servicio)
            //     const registro_ServicioPromocion = await Servicio_promocion.findOne({
            //         where: { id_servicio },
            //         include: [{
            //             model: Promocion,
            //             attributes: [
            //                 'horas'
            //             ],
            //         }],
            //     });
            //     let h = habitaciones.find(habitacion => habitacion.servicios[0]?.id === id_servicio);
            //     h.pagado = registro_ServicioPromocion?.estado;
            //     h.horas = registro_ServicioPromocion?.promocione.horas;
            //     array_final.push(h);
            // }
            // else {
            //     array_final.push(habitacion);
            // }
        };
        return res.status(200).json({
            ok: true,
            listaHabitaciones: array_final
        });
    }
    catch (error) {
        console.log(error)
        res.json({
            ok: false,
            msg: 'Error, Hable con el administrador'
        });
    }
};

const habilitarHabitacion = async (req, res) => {
    try {
        const { id } = req.body; // id habitacion
        const habitacion = await Habitacion.findOne({
            where: { id }
        });
        if (habitacion.id_estado === 3) {
            habitacion.id_estado = 1;
            habitacion.save();
            // Registro de aseo 
            const addRegistro = await Registro.create({
                id_habitacion: id,
                id_usuario: req.id_usuario,
                fecha: sequelize.literal("CURRENT_TIMESTAMP"),
                fecha_entrada: null,
                observacion: `Habitacion ${id} aseada`
            });
            // Descontar sabanas y toallas
            descInv(19, 1);
            descInv(20, 2);
            return res.status(200).json({
                ok: true,
                msg: 'Habitacion habilitada correctamente'
            });
        }
        return res.status(200).json({
            ok: true,
            msg: 'La habitacion no esta en estado de aseo'
        });
    }
    catch (error) {
        return res.status(200).json({
            ok: false,
            msg: 'Error, Hable con el administrador'
        });
    }
};

const reservarHabitacion = async (req, res) => {
    try {
        const { id, clientes, servicios, extras, metodo_de_pago } = req.body;
        // Consultar el estado
        const consultarEstado = await Habitacion.findOne({
            where: {
                id,
                id_estado: 1,
            },
        });

        // En caso de algun error estas variables se modifican y se envian al cliente
        let error = false;
        let msg;

        // Variables para tabla registro
        let registro_idServicio = 0;
        let registro_idHabitacion = 0;
        let registro_fechaEntrada = '';
        let registro_fechaTransaccion = '';
        let registro_monto = 0;
        let registro_observacion = '';


        // Si el estado es disponible entonces registro el cliente
        if (consultarEstado) {
            const arreglo = [];

            for (let cliente of clientes) {
                const findClient = await Cliente.findOne({
                    where: {
                        rut: cliente.rut,
                    },
                    attributes: ["id", "nombre", "apellido", "rut"],
                });

                if (!findClient) {
                    const createCliente = await Cliente.create(
                        {
                            nombre: cliente.nombre,
                            apellido: cliente.apellido,
                            rut: cliente.rut,
                        },
                        {
                            fields: ["nombre", "apellido", "rut"],
                            attributes: ["id"],
                        }
                    );
                    const client = createCliente.id;
                    arreglo.push(client);
                } else {
                    const client = findClient.id;
                    arreglo.push(client);
                }
            } // end for

            const newService = await Servicio.create({
                id_habitacion: id,
                fecha: sequelize.literal("CURRENT_TIMESTAMP"),
                hr_entrada: sequelize.literal("CURRENT_TIME"),
                total: 0,
                id_cliente1: arreglo[0],
                id_cliente2: arreglo[1],
                estado: 'Pendiente'
            });

            // Para tabla registro
            registro_idServicio = newService.id;
            registro_idHabitacion = id;
            registro_fechaEntrada = sequelize.literal("CURRENT_TIMESTAMP");

            // Agregar servicio
            let n_promocion = 1;
            for await (let service of servicios) {
                const findPromocion = await Promocion.findOne({
                    where: {
                        id: service.id_promocion,
                    },
                });
                if (findPromocion) {
                    if (findPromocion.id !== 1) {
                        // Consultar stock del producto
                        let addPromo = await Servicio_promocion.create({
                            id_promocion: service.id_promocion,
                            id_servicio: newService.id,
                            id_tipo_pago: metodo_de_pago,
                            //id_producto1: service.id_producto1,
                            id_producto1: service.id_productos[0],
                            id_producto2: service.id_productos[1],
                            //id_producto2: service.id_producto2,
                            estado: false,
                        });
                        // Descontamos los productos de inventario
                        descInv(service.id_productos[0], 1);
                        descInv(service.id_productos[1], 1);
                        // Agregamos la venta en tabla balance_aux (CAJA Y VENTAS)
                        let balance_aux = await Balance_aux.findOne({
                            where: { id: 1 }
                        });
                        if (parseInt(metodo_de_pago) === 1) {
                            balance_aux.caja += findPromocion.precio;
                        }
                        balance_aux.ventas += findPromocion.precio;
                        await balance_aux.save();
                        // Para tabla registro
                        const producto1 = await Producto.findOne({
                            where: { id: service.id_productos[0] }
                        });
                        const producto2 = await Producto.findOne({
                            where: { id: service.id_productos[1] }
                        });
                        registro_monto += findPromocion.precio;
                        registro_observacion += ` Promocion ${n_promocion}: $${findPromocion.precio} - ${producto1.nombre} - ${producto2.nombre}.`
                        n_promocion += 1;
                    }
                    else {
                        let addPromo = await Servicio_promocion.create({
                            id_promocion: service.id_promocion,
                            id_servicio: newService.id,
                            id_tipo_pago: metodo_de_pago,
                            //id_producto1: service.id_producto1,
                            id_producto1: service.id_productos[0],
                            id_producto2: service.id_productos[1],
                            //id_producto2: service.id_producto2,
                            estado: false,
                        });
                        // Agregamos la venta en tabla balance_aux (CAJA Y VENTAS)
                        let balance_aux = await Balance_aux.findOne({
                            where: { id: 1 }
                        });
                        if (parseInt(metodo_de_pago) === 1) {
                            balance_aux.caja += findPromocion.precio;
                        }
                        balance_aux.ventas += findPromocion.precio;
                        await balance_aux.save();
                        // Para tabla registro
                        registro_monto += findPromocion.precio;
                        registro_observacion += ` Promocion ${n_promocion}: $${findPromocion.precio}`
                        n_promocion += 1;
                    }
                } else {
                    return res.json({
                        ok: false,
                        msg: "Servicio no existe",
                    });
                }
            };

            // Agrego los extras si existen tabla pedidos y producto pedido
            if (extras) {
                const objCantidadExtras = cantidad_extras(extras);
                // [
                //     { id_producto: '1', cantidad: 1 },
                //     { id_producto: '2', cantidad: 1 },
                //     { id_producto: '3', cantidad: 1 },
                //     { id_producto: '4', cantidad: 1 }
                // ]
                const addPedido = await Pedido.create({
                    id_servicio: newService.id,
                    id_tipo_pago: metodo_de_pago,
                    estado: "pendiente",
                    //total
                });
                let numerito = 1;
                for await (let extra of objCantidadExtras) {
                    await Detalle_pedido.create({
                        id_pedido: addPedido.id,
                        id_producto: extra.id_producto,
                        cantidad: extra.cantidad,
                    });
                    // Agregamos precio de cada producto a ventas en balance_aux
                    const producto = await Producto.findOne({
                        where: {
                            id: extra.id_producto
                        }
                    });
                    // Descontamos de inventario
                    const resp = await descInv(extra.id_producto, extra.cantidad);
                    if (!resp) {
                        error = true
                        msg = `El producto ${producto.nombre} no tiene stock suficiente`;
                        break;
                    }
                    const balance_aux = await Balance_aux.findOne({
                        where: {
                            id: 1
                        }
                    });
                    const ingresos = producto.precio * extra.cantidad;
                    balance_aux.ventas += ingresos;
                    await balance_aux.save();
                    if (parseInt(metodo_de_pago) === 1) {
                        balance_aux.caja += ingresos;
                        await balance_aux.save();
                    }
                    // Para tabla registro
                    registro_monto += ingresos;
                    registro_observacion += ` Extra ${numerito}: ${producto.nombre}.`
                    numerito += 1;
                };
            }

            // Cambiar estado de la habitacion a ocupada
            await Habitacion.update(
                {
                    id_estado: 2,
                },
                {
                    where: {
                        id,
                    },
                }
            );

            await Registro.create({
                id_servicio: registro_idServicio,
                id_usuario: req.id_usuario,
                id_habitacion: registro_idHabitacion,
                fecha: registro_fechaEntrada,
                fecha_entrada: registro_fechaEntrada,
                monto: registro_monto,
                observacion: registro_observacion
            });

            return res.status(200).json({
                ok: error ? false : true,
                msg: error ? msg : "Habitacion reservada",
            });
        } else {
            return res.json({
                ok: false,
                msg: "Error, la habitación no está disponible",
            });
        }
    } catch (e) {
        console.log(e);
        return res.status(200).json({
            ok: false,
            msg: "Ha ocurrido un error, por favor contacte al administrador",
        });
    }
};

const cancelarReserva = async (req, res) => {
    try {
        const { id_servicio } = req.body;

        // Obtenemos servicio
        const servicio = await Servicio.findOne({
            where: { id: id_servicio }
        });
        // Obtenemos habitacion
        const getHabitacion = await Habitacion.findOne({
            where: { id: servicio.id_habitacion }
        });

        if (!servicio) {
            return res.status(200).json({
                ok: false,
                msg: 'No existe el servicio'
            });
        }

        // Servicio estado cancelado
        servicio.estado = 'Cancelado';
        await servicio.save();

        // Cambiamos habitacion a estado disponible
        getHabitacion.id_estado = 1;
        getHabitacion.save();

        // Quitar todo respecto a servicio_promociones (y de tabla AUX)
        const servicio_promociones = await Servicio_promocion.findAll({
            where: { id_servicio: servicio.id }
        });
        for await (let servicio_promocion of servicio_promociones) {
            // Devolvemos los bebestibles de la promocion a inventario
            addInv(servicio_promocion.id_producto1, 1);
            addInv(servicio_promocion.id_producto2, 1);
            // Quitamos de ventas aux el precio de cada promocion si es que pagó en efectivo
            const promocion = await Promocion.findOne({
                where: { id: servicio_promocion.id_promocion }
            });
            const balance_aux = await Balance_aux.findOne({
                where: { id: 1 }
            });
            if (servicio_promocion.id_tipo_pago === 1) {
                balance_aux.caja -= promocion.precio;
            }
            balance_aux.ventas -= promocion.precio;
            await balance_aux.save();
            await servicio_promocion.destroy();
        };
        // Quitar todo respecto a pedidos (Actualizar AUx e inventario)
        const pedidos = await Pedido.findAll({
            where: { id_servicio }
        });
        // Quitamos todas las relaciones en detalle_pedidos
        for await (let pedido of pedidos) {
            const detalle_pedidos = await Detalle_pedido.findAll({
                where: { id_pedido: pedido.id }
            });
            for await (let detalle_pedido of detalle_pedidos) {
                const producto = await Producto.findOne({
                    where: { id: detalle_pedido.id_producto }
                });
                const balance_aux = await Balance_aux.findOne({
                    where: { id: 1 }
                });
                // Devolvemos la cantidad de productos a inventario
                addInv(producto.id, detalle_pedido.cantidad);
                if (pedido.id_tipo_pago === 1) {
                    balance_aux.caja -= producto.precio;
                }
                balance_aux.ventas -= producto.precio;
                await balance_aux.save();
            }
        }

        // Registro para tabla registro
        const addRegistro = await Registro.create({
            id_servicio: id_servicio,
            id_habitacion: servicio.id_habitacion,
            id_usuario: req.id_usuario,
            fecha: sequelize.literal("CURRENT_TIMESTAMP"),
            fecha_entrada: servicio.fecha,
            observacion: `Habitacion ${servicio.id_habitacion}, reserva cancelada`
        });
        return res.status(200).json({
            ok: true,
            msg: 'Habitacion cancelada'
        });
    } catch (e) {
        res.json({
            ok: false,
            msg: "Ha ocurrido un error, por favor contacte al administrador",
        });
    }
};

const desalojarHabitacion = async (req, res) => {
    const { id } = req.body; // id servicio
    try {
        const findService = await Servicio.findOne({
            where: { id },
            attributes: ["id", "hr_salida", 'id_habitacion', 'fecha'],
        });
        if (!findService.hr_salida) {
            // Registro para tabla registro
            const addRegistro = await Registro.create({
                id_servicio: id,
                id_habitacion: findService.id_habitacion,
                id_usuario: req.id_usuario,
                fecha: sequelize.literal("CURRENT_TIMESTAMP"),
                fecha_entrada: findService.fecha,
                observacion: `Habitacion ${findService.id_habitacion} desalojada`
            });

            const serSalida = await Servicio.update(
                {
                    hr_salida: sequelize.literal("CURRENT_TIME")
                },
                {
                    fields: ["hr_salida"],
                    where: { id },
                    attributes: ["id", "id_habitacion"],
                }
            );
            const setEstado = await Habitacion.update(
                {
                    id_estado: 3
                },
                {
                    fields: ["id_estado"],
                    where: { id: findService.id_habitacion },
                    attributes: ["id"],
                }
            );
            findService.estado = "Finalizado";
            findService.save();
            return res.json({
                ok: true,
                msg: "Habitacion desalojada",
            });
        }
        else {
            res.json({
                ok: false,
                msg: 'habitacion ya está desalojada'
            })
        }
    } catch (e) {
        res.json({
            ok: false,
            msg: "Ha ocurrido un error, por favor contacte al administrador",
        });
    }
};

const listarPromociones = async (req, res = response) => {
    try {
        const promociones = await Promocion.findAll();
        return res.json({
            ok: false,
            msg: promociones,
        });
    } catch (error) {
        console.log(error);
        return res.json({
            ok: false,
            msg: "Ha ocurrido un error, por favor contacte al administrador",
        });
    }
};

const calcularTotalServicio = async (req, res) => {
    const { id } = req.body;
    try {

    }
    catch (e) {
        res.json({
            ok: false,
            msg: "Ha ocurrido un error, por favor contacte al administrador",
        });
    }
};

// const desalojarHabitacion = async (req, res) => {
//   const { id } = req.body;
//   try {
//     const findService = await Servicio.findOne({
//       where: {
//         id,
//       },
//       attributes: ["id", "id_habitacion", "hr_salida"],
//     });

//     if (!findService.hr_salida) {
//     //   const findPedidoImpago = await Pedido.findAll({
//     //     where: {
//     //       id_servicio: id,
//     //       estado: "pendiente",
//     //     },
//     //     attributes: ["id", "estado"],
//     //   });

//     //   const findImpago = await Servicio_promocion.findAll({
//     //     where: {
//     //       id_servicio: id,
//     //       estado: false,
//     //     },
//     //     attributes: ["id", "estado"],
//     //   });
//     //   console.log(findImpago);
//     //   console.log(findPedidoImpago.dataValues.estado);
//       // if (findPedidoImpago.dataValues.estado === 'pendiente' || findImpago.dataValues.estado === false) {
//       //     console.log('paga la wea');
//       //     res.json({
//       //         ok: false,
//       //         msg: 'Pieza presenta impagos',
//       //         findService,
//       //         findImpago
//       //     });

//       // }
//       // else {
//     }
//   } catch (e) {
//     res.json({
//       ok: false,
//       msg: "Ha ocurrido un error, por favor contacte al administrador",
//     });
//   }
// };

const getServicio = async (req, res = response) => {
    try {
        const { id } = req.query;

        const findService = await Servicio.findOne({
            where: {
                id
            },
            attributes: ['id_habitacion', 'id_cliente1', 'id_cliente2'],
            include: [
                Promocion,
                {
                    model: Pedido,
                    include: [Producto]
                }]
        });

        if (findService) {
            //datos cliente
            const findCliente1 = await Cliente.findOne({
                where: {
                    id: findService.id_cliente1
                }
            });
            const findCliente2 = await Cliente.findOne({
                where: {
                    id: findService.id_cliente2
                }
            });

            const cliente1 = findCliente1;
            const cliente2 = findCliente2;


            return res.json({
                ok: true,
                findService,
                cliente1,
                cliente2

            });
        }
        else {
            return res.json({
                ok: false,
                msg: 'No se encontro el servicio'
            });
        }

    }
    catch (e) {
        return res.json({
            ok: false,
            msg: 'Error, contacte con administración'
        });
    }
};

const editarServicio = async (req, res = response) => {
    try {


        return res.json({
            ok: true,
            msg: 'editarServicio'
        });
    }
    catch (e) {
        return res.json({
            ok: false,
            msg: 'Error, contacte con administración'
        });
    }
};

const editarPromocion = async (req, res = response) => {
    try {
        const { id_servicio, id_promocion, id_producto1, id_producto2 } = req.body;
        const servicio = await Servicio.findOne({
            where: { id: id_servicio }
        });
        const servicio_promocion = await Servicio_promociones.findOne({
            where: {
                id_servicio,
                id_promocion
            }
        });
        if (!servicio_promocion) {
            return res.json({
                ok: false,
                msg: 'No se han encontrado los datos seleccionados'
            });
        }
        // Primero devolvemos los producto actuales de la promocion
        addInv(servicio_promocion.id_producto1, 1);
        addInv(servicio_promocion.id_producto2, 1);
        // Descontamos de caja si es con efectivo y ventas
        const balance_aux = await Balance_aux.findOne({
            where: { id: 1 }
        });
        const productoAntiguo1 = await Producto.findOne({
            where: { id: servicio_promocion.id_producto1 }
        });
        const productoAntiguo2 = await Producto.findOne({
            where: { id: servicio_promocion.id_producto2 }
        });
        if (servicio_promocion.id_tipo_pago === 1) {
            balance_aux.caja -= productoAntiguo1.precio;
            balance_aux.caja -= productoAntiguo2.precio;
        }
        balance_aux.ventas -= productoAntiguo1.precio;
        balance_aux.ventas -= productoAntiguo2.precio;
        await balance_aux.save();
        // Agremos los nuevos producto a la promocion
        const productoNuevo1 = await Producto.findOne({
            where: { id: id_producto1 }
        });
        const productoNuevo2 = await Producto.findOne({
            where: { id: id_producto2 }
        });
        servicio_promocion.id_producto1 = id_producto1;
        servicio_promocion.id_producto2 = id_producto2;
        servicio_promocion.save();
        // Descontamos los nuevos productos de inventario
        await descInv(id_producto1, 1);
        await descInv(id_producto2, 1);
        // Creamos el registro
        await Registro.create({
            id_servicio: id_servicio,
            id_habitacion: servicio.id_habitacion,
            id_usuario: req.id_usuario,
            fecha: sequelize.literal("CURRENT_TIMESTAMP"),
            fecha_entrada: servicio.fecha,
            observacion: `Productos del servicio de la habitación ${servicio.id_habitacion} han sido cambiados. Nuevos: ${productoNuevo1.nombre} - ${productoNuevo2.nombre}`
        });
        return res.json({
            ok: true,
            msg: 'La promoción ha sido actualizada'
        });
    }
    catch (e) {
        console.log(e);
        return res.json({
            ok: false,
            msg: 'Error, contacte con administración'
        });
    }
};

module.exports = {
    estadoHabitaciones,
    listarHabitaciones,
    habilitarHabitacion,
    reservarHabitacion,
    cancelarReserva,
    desalojarHabitacion,
    listarPromociones,
    getServicio,
    editarServicio,
    editarPromocion
};
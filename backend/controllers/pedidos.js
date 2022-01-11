const { response } = require("express");
const sequelize = require("sequelize");
// Models
const Servicio = require("../models/servicio");
const Pedido = require("../models/pedido");
const Detalle_pedido = require("../models/detalle_pedido");
const Inventario = require("../models/inventario");
const Balance_aux = require("../models/balance_aux");
const Producto = require("../models/producto");
const Registro = require("../models/registro");

// Helpers
const cantidad_extras = require("../helpers/cantidad_extras");
const descInv = require("../helpers/desc-inv");
const addInv = require("../helpers/add-inv");

const agregarPedido = async (req, res = response) => {
  try {
    const { id_servicio, extras, metodo_de_pago } = req.body;
    const findServicio = await Servicio.findOne({
      where: { id: id_servicio },
    });

    // En caso de algun error estas variables se modifican y se envian al cliente
    let error = false;
    let msg;

    if (!findServicio) {
      return res.status(200).json({
        ok: false,
        msg: "No existe el servicio",
      });
    }
    // Agrego los extras si existen tabla pedidos y producto pedido
    if (!extras) {
      return res.status(200).json({
        ok: false,
        msg: "No hay extras seleccionados",
      });
    }
    const addPedido = await Pedido.create({
      id_servicio: id_servicio,
      id_tipo_pago: metodo_de_pago,
      estado: "Pendiente",
    });
    // Transformamos extras a un objeto
    const objCantidadExtras = cantidad_extras(extras);
    // [
    //     { id_producto: '1', cantidad: 1 },
    //     { id_producto: '2', cantidad: 2 },
    //     { id_producto: '3', cantidad: 3 },
    //     { id_producto: '4', cantidad: 4 }
    // ]
    for (let extra of objCantidadExtras) {
      await Detalle_pedido.create({
        id_pedido: addPedido.id,
        id_producto: extra.id_producto,
        cantidad: extra.cantidad,
      });
      // Agregamos precio de cada producto a ventas en balance_aux
      const producto = await Producto.findOne({
        where: { id: extra.id_producto },
      });
      // Descontamos de inventario
      const resp = await descInv(extra.id_producto, extra.cantidad);
      if (!resp) {
        error = true;
        msg = `El producto ${producto.nombre} no tiene stock suficiente`;
        break;
      }
      const balance_aux = await Balance_aux.findOne({
        where: { id: 1 },
      });
      const ingresos = producto.precio * extra.cantidad;
      balance_aux.ventas += ingresos;
      if (metodo_de_pago === 1) {
        balance_aux.caja += ingresos;
      }
      await balance_aux.save();
    }
    //generar registro
    await Registro.create({
      id_usuario: req.id_usuario,
      id_servicio,
      id_habitacion: findServicio.id_habitacion,
      fecha_entrada: findServicio.fecha_entrada,
      fecha: sequelize.fn("NOW"),
      monto,
      observacion: `Pedido agregado`,
    });

    return res.status(200).json({
      ok: error ? false : true,
      msg: error ? msg : "Pedido creado",
      id_pedido: addPedido.id
    });
  } catch (e) {
    return res.status(200).json({
      ok: false,
      msg: "No se encontró el servicio",
    });
  }
};

const eliminarPedido = async (req, res = response) => {
  try {
    const { id_servicio, id_pedido, id_producto } = req.body;

    const findService = await Servicio.findOne({
      where: { id: id_servicio },
    });

    const pedido = await Pedido.findOne({
      where: { id_servicio },
    });
    if (findService && pedido) {
      console.log(pedido.id);
      console.log(findService.id);
      const detalle_pedido = await Detalle_pedido.findOne({
        where: {
          id_pedido,
          id_producto,
        },
      });
      const producto = await Producto.findOne({
        where: { id: id_producto },
      });

      if (detalle_pedido) {
        if (detalle_pedido.cantidad > 1) {
          detalle_pedido.cantidad -= 1;
          detalle_pedido.save();
          addInv(id_producto, 1);
          const balance_aux = await Balance_aux.findOne({
            where: { id: 1 },
          });
          if (pedido.id_tipo_pago === 1) {
            balance_aux.caja -= producto.precio;
          }
          balance_aux.ventas -= producto.precio;
          await balance_aux.save();
          await Registro.create({
            fecha: sequelize.fn('NOW'),        
            id_usuario: req.id_usuario,
            observacion: `Se cancelo el producto ${detalle_pedido.nombre}`
        });
        } else {
          const delPedido = await Detalle_pedido.destroy({
            where: {
              id_pedido,
              id_producto,
            },
          });
        
          await Registro.create({
            id_servicio,
            id_habitacion: findService.id_habitacion,
            fecha_entrada: findService.fecha,
            fecha: sequelize.fn('NOW'),        
            id_usuario: req.id_usuario,
            observacion: `Se cancelo el producto ${producto.nombre}`
        });
        }

        res.json({
          ok: true,
          msg: "Pedido descontado con exito, eres crack",
        });
      } else {
        res.json({
          ok: false,
          msg: "Producto invalido o no se encuentra en un pedido",
          error: "431",
        });
      }
    } else {
      res.json({
        ok: false,
        msg: "No se pudo eliminar el pedido",
        error: "432",
      });
    }
  } catch (e) {
    console.log(e);
    res.json({
      ok: false,
      msg: "Error al eliminar el pedido",
    });
  }
};

module.exports = {
  agregarPedido,
  eliminarPedido,
};

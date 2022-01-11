const { response } = require("express");
const Tipo_habitacion = require("../models/tipo_habitacion");
const Cliente = require("../models/cliente");
const Habitacion = require("../models/habitaciones");
const Estado = require("../models/estado");
const Pedido = require("../models/pedido");
const Promocion = require("../models/promocion");
const Servicio = require("../models/servicio");
const Servicio_promocion = require("../models/servicio_promociones");
const Detalle_pedido = require("../models/detalle_pedido");
const Servicio_promociones = require("../models/servicio_promociones");
const sequelize = require("../database/database");

const Retiro = require("../models/retiro");
const Balance_aux = require("../models/balance_aux");
const Gasto_caja = require("../models/gasto_caja");
const Balance = require("../models/balance");
const Registro = require("../models/registro");

const calcularTotalVentas = async (req, res) => {
  const { id } = req.body;
  try {
    const findVentas = await Pedido.findAll();
  } catch (e) {
    console.log(e);
    return res.json({
      ok: false,
      msg: "Ha ocurrido un error, por favor contacte al administrador",
    });
  }
};

//registrar retiro
const newRetiro = async (req, res) => {
  let { monto, descripcion } = req.body;
  monto = parseInt(monto);
  try {
    //primero hay que ver que el monto no sea mayor a el dinero en caja
    const compareCaja = await Balance_aux.findOne({
      where: {
        id: 1,
      },
      attributes: ["id", "retiros", "caja"],
    });
    if (monto > compareCaja.caja) {
      return res.json({
        ok: false,
        msg: "El Retiro supera el monto de la caja",
      });
    } else {
      //generar registro
     
      await Registro.create({
        fecha: sequelize.fn('NOW'),        
        id_usuario: req.id_usuario,
        observacion: `retiro dinero caja por $${monto}`
    });

      //actualizar los retiros
      compareCaja.retiros = compareCaja.retiros + monto;
      compareCaja.caja = compareCaja.caja - monto;
      compareCaja.save();

      //registro en tabla retiro
      const nuevoRetiro = await Retiro.create({
        id_usuario: req.id_usuario,
        monto,
        descripcion,
        fecha: sequelize.fn('NOW'),
      });

      return res.json({
        ok: true,
        msg: "Retiro registrado",
      });
    }
  } catch (e) {
    console.log(e);
    return res.json({
      ok: false,
      msg: "Ha ocurrido un error, por favor contacte al administrador",
    });
  }
};
//registrar gasto
const newGasto = async (req, res) => {
  let { monto, descripcion } = req.body;
  monto = parseInt(monto);
  try {
    const compareCaja = await Balance_aux.findOne({
      where: {
        id: 1,
      },
      attributes: ["id", "gastos", "caja"],
    });
    if (monto > compareCaja.caja) {
      return res.json({
        ok: false,
        msg: "El Gasto supera el monto de la caja",
      });
    } else {
        //generar registro
        await Registro.create({
          fecha: sequelize.fn('NOW'),        
          id_usuario: req.id_usuario,
          observacion: `Gasto nuevo por $${monto}. Descripción: "${descripcion}"`
      });
      //registro en tabla retiro
      const newGasto = await Gasto_caja.create({
        id_usuario:req.id_usuario,
        monto,
        descripcion,
        fecha: sequelize.fn("now"),
      });

      //actualizar los retiros
      compareCaja.gastos = compareCaja.gastos + monto;
      compareCaja.caja = compareCaja.caja - monto;
      compareCaja.save();

      return res.json({
        ok: true,
        msg: "Gasto registrado",
      });
    }
  } catch (e) {
    console.log(e);
    return res.json({
      ok: false,
      msg: "Ha ocurrido un error, por favor contacte al administrador",
    });
  }
};
//realizar gasto_inventario desde inventario

//getall retiros
const allRetiros = async (req, res) => {
  // const { id } = req.body;
  try {
    const findRetiros = await Retiro.findAll({
      attributes: ["id", "id_usuario", "monto", "descripcion", "fecha"],
    });

    return res.json({
      ok: true,
      findRetiros,
    });
  } catch (e) {
    console.log(e);
    return res.json({
      ok: false,
      msg: "Ha ocurrido un error, por favor contacte al administrador",
    });
  }
};
//get all gastos
const allGastos = async (req, res) => {
  // const { id } = req.body;
  try {
    const findGastos = await Gasto_caja.findAll({
      attributes: ["id", "id_usuario", "monto", "descripcion", "fecha"],
    });

    return res.json({
      ok: true,
      findGastos,
    });
  } catch (e) {
    console.log(e);
    res.json({
      ok: false,
      msg: "Ha ocurrido un error, por favor contacte al administrador",
    });
  }
};

const cierreCaja = async (req, res) => {
  const { id_usuario } = req.body;
  try {
    const balance_aux = await Balance_aux.findOne({
      where: { id: 1 } 
    });

    const updateBalance = await Balance.update(
      {
        id_usuario: id_usuario,
        ventas_total: balance_aux.ventas,
        retiros_total: balance_aux.retiros,
        gastos_total: balance_aux.gastos,
        caja_final: balance_aux.caja,
        fecha: sequelize.literal("CURRENT_DATE"),
      },
      {
        where: {
          id: balance_aux.id_balance,
        },
        attributes: ["caja_final"],
      }
    );

    const getValue = await Balance.findOne(
      {
        where: {
          id: balance_aux.id_balance,
        },
      },
      {
        attributes: ["caja_final"],
      }
    );
    const newBalance = await Balance.create({
        id_usuario: null,
        caja_anterior: getValue.caja_final,
        ventas_total:null,
        retiros_total: null,
        gastos_total: null,
        caja_final: null,
        fecha: sequelize.literal("CURRENT_DATE")
    });
    // Actualizo la tabla aux a cero menos la caja
    balance_aux.ventas = 0;
    balance_aux.retiros = 0;
    balance_aux.gastos = 0;
    balance_aux.id_balance = newBalance.id;
    balance_aux.save();

    return res.json({
      ok: true,
      msg: "Balance realizado con exito",
    });
  } catch (e) {
    console.log(e);
    return res.json({
      ok: false,
      msg: "Ha ocurrido un error, por favor contacte al administrador",
    });
  }
};

const informacionCaja = async (req, res) => {
  try {
    const findVentas = await Balance_aux.findOne(
      {
        where: {
          id: 1,
        },
      },
      {
        attributes: ["ventas", "gastos", "retiros", "caja"],
      }
    );
    const caja = [
      {
        caja: findVentas.caja,
        ventas: findVentas.ventas,
        gastos: findVentas.gastos,
        retiros: findVentas.retiros,
      },
    ];
    return res.json({
      ok: true,
      caja
    });
  } catch (e) {
    console.log(e);
    return res.json({
      ok: false,
      msg: "error, contacte con el administrador",
    });
  }
};

const informacionMensual = async (req, res) => {
  try {
    let months = [
      "Enero",
      "Febrero",
      "Marzo",
      "Abril",
      "Mayo",
      "Junio",
      "Julio",
      "Agosto",
      "Septiempre",
      "Octubre",
      "Noviembre",
      "Diciembre",
    ];

    const info = await Balance.findAll(
      {
        attributes: [
          [sequelize.fn('date_trunc', 'month', sequelize.col('fecha')), 'fechamen'],
          [sequelize.fn('sum', sequelize.col('ventas_total')), 'ventas'],
          [sequelize.fn('sum', sequelize.col('gastos_total')), 'gastos'],
          [sequelize.fn('sum', sequelize.col('retiros_total')), 'retiros']],

        group: ['fechamen'],
        order: [[sequelize.literal('fechamen'), 'ASC']]
      }
    );
    const info_aux = await Balance_aux.findOne(

      {where: {id:1},
         attributes: ['ventas','retiros','gastos','caja']
      }
    );

    console.log(info_aux.ventas)
    // let infoActual = [{
    //   ventas : info_aux.ventas,
    //   retiros : info_aux.retiros,
    //   gastos :info_aux.gastos,
    //   caja : info_aux.caja,
    //   }]
    
     let informacion = []
     
     //calculo mes actual
     const d = new Date();
    let mesActual =d.getMonth()

    
      info.map ( i =>{
       
      let date = i.dataValues.fechamen
       let mes = new Date(i.dataValues.fechamen)
      
      
       if (date != null && mes.getMonth() != mesActual ){
      //  if (date != null ){
        
        const fecha = new Date(i.dataValues.fechamen)

        informacion.push({
          fecha: months[fecha.getMonth()],
          ventas: i.dataValues.ventas,
          retiros: i.dataValues.retiros,
          gastos: i.dataValues.gastos
        })

        
      }
       
      else if(date != null && mes.getMonth() == mesActual){
        informacion.push({
          fecha : months[mes.getMonth()],
          ventas : parseInt(i.dataValues.ventas) + parseInt(info_aux.ventas) ,
          retiros: parseInt(i.dataValues.retiros)+ parseInt(info_aux.retiros),
          gastos: parseInt(i.dataValues.gastos)+ parseInt(info_aux.gastos)
        })
      }
    });
             
       return res.json({
         ok: true,
         caja: info_aux.caja,
         informacion
         
        });
      }
   catch (e) {
    console.log(e);
    return res.json({
      ok: false,
      msg: "error, contacte con el administrador",
    });
  }
};

module.exports = {
  newRetiro,
  newGasto,
  allRetiros,
  allGastos,
  cierreCaja,
  informacionCaja,
  informacionMensual
};



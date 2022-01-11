const { response } = require("express");
const sequelize = require("../database/database");
const Balance = require("../models/balance");

const Registro = require("../models/registro");
const Usuario = require("../models/usuario");
const Sequelize = require('sequelize');
const Op = Sequelize.Op

const getRegistros = async (req, res = response) => {
  try {
    const allRegistros = await Registro.findAll({
      attributes: [
        'id', 'id_servicio', 'id_habitacion', 'fecha', 'fecha_entrada', 'monto', 'observacion'
      ],
      include: [{
        model: Usuario
      }],
      order: [['fecha', 'DESC']]
    });
    return res.json({
      ok: true,
      allRegistros,
    });
  } catch (e) {
    console.log(e);
    return res.json({
      ok: false,
      msg: "Error contacte a administrador",
    });
  }
};

const getRegistrosTurno = async (req, res = response) => {
  try {

    const getBalance = await Balance.findOne({
      where:{
        fecha:{ [Op.ne]: null} 
      },
      order:[['fecha','DESC']],
    });

    var startDate = getBalance.fecha
    var endDate = new Date();
  
    const allRegistros = await Registro.findAll({
      attributes: [
        'id', 'id_servicio', 'id_habitacion', 'fecha', 'fecha_entrada', 'monto', 'observacion'
      ],
      include: [{
        model: Usuario
      }],
      order: [['fecha', 'DESC']]
    },
    {
      where:{
        $and:[{ fecha: {gte: startDate} },
          { fecha: {lt: endDate} }]
      }
    }
    );
    return res.json({
      ok: true,
      allRegistros,
    });
  } catch (e) {
    console.log(e);
    return res.json({
      ok: false,
      msg: "Error contacte a administrador",
    });
  }
};

const getRegistrosVentasTurno = async (req, res = response) => {
  try {

    const getBalance = await Balance.findOne({
      where:{
        fecha:{ [Op.ne]: null} 
      },
      order:[['fecha','DESC']],
    });

    var startDate = getBalance.fecha
    var endDate = new Date();
  
    const allRegistros = await Registro.findAll({
      attributes: [
        'id', 'id_servicio', 'id_habitacion', 'fecha', 'fecha_entrada', 'monto', 'observacion'
      ],
      where:{
        monto:{ [Op.ne]: null} 
      },
      include: [{
        model: Usuario
      }],
      order: [['fecha', 'DESC']]
    },
    {
      where:{
        $and:[{ fecha: {gte: startDate} },
          { fecha: {lt: endDate} }]
      }
    }
    );
    return res.json({
      ok: true,
      allRegistros,
    });
  } catch (e) {
    console.log(e);
    return res.json({
      ok: false,
      msg: "Error contacte a administrador",
    });
  }
};



module.exports = {
  getRegistros,
  getRegistrosTurno,
  getRegistrosVentasTurno
};
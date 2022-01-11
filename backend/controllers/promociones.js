const { response } = require('express');
const Promocion = require('../models/promocion');

const getPromociones = async (req, res = response) => {
    try {
        const promociones = await Promocion.findAll();
        return res.status(200).json({
            ok: true,
            msg: promociones
        });
    }
    catch (error) {
        return res.status(200).json({
            ok: false,
            msg: 'Error al obtener las promociones, hable con el administrador'
        });
    }
};

const crearPromocion = async (req, res = response) => {
    try {
        const { horas, precio, bebida, trago, descripcion } = req.body;
        await Promocion.create({
            horas,
            precio,
            bebida,
            trago,
            descripcion
        });
        return res.status(200).json({
            ok: true,
            msg: 'Promocion creada correctamente'
        });
    }
    catch (error) {
        return res.status(200).json({
            ok: false,
            msg: 'Error al crear promocion, hable con el administrador'
        });
    }
};

const editarPromocion = async (req, res = response) => {
    try {
        const { id, horas, precio, bebida, trago, descripcion } = req.body;
        const promocion = await Promocion.findOne({
            where: { id }
        });
        promocion.horas = horas;
        promocion.precio = precio;
        promocion.bebida = bebida;
        promocion.trago = trago;
        promocion.descripcion = descripcion;
        promocion.save();
        return res.status(200).json({
            ok: true,
            msg: 'Promocion actualizada correctamente'
        });
    }
    catch (error) {
        return res.status(200).json({
            ok: false,
            msg: 'Error al editar promocion, hable con el administrador'
        });
    }
};

const eliminarPromocion = async (req, res = response) => {
    try {
        const { id } = req.body;
        const promocion = await Promocion.findOne({
            where: { id }
        });
        promocion.destroy();
        return res.status(200).json({
            ok: true,
            msg: 'Promocion eliminada correctamente'
        });
    }
    catch (error) {
        return res.status(200).json({
            ok: false,
            msg: 'Error al crear promocion, hable con el administrador'
        });
    }
};

module.exports = {
    getPromociones,
    crearPromocion,
    editarPromocion,
    eliminarPromocion
};
const { response } = require('express');
const { Op } = require("sequelize");

const Tipo_producto = require('../models/tipo_producto');
const Producto = require('../models/producto');
const Bodega = require('../models/bodega');
const Inventario = require('../models/inventario');

const getInventario = async (req, res = response) => {
    try {
        const findAllProducts = await Producto.findAll({
            attributes: [
                'id',
                'nombre',
                'precio'
            ],
            include: [{
                model: Tipo_producto,
                attributes: [
                    'tipo',
                ]
            }, {
                model: Inventario,
                attributes: [
                    'cantidad',
                ],
                where: {
                    cantidad: { [Op.gte]: 0 }
                }
            }]
        });
        return res.status(200).json({
            ok: true,
            inventario: findAllProducts
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: 'Ha ocurrido un error, por favor contacte al administrador'
        });
    }
};

const crearProductoInventario = async (req, res = response) => {
    try {
        const { id, categoria, cantidad, precio } = req.body;

        const producto = await Producto.findOne({
            where: { id }
        });

        if (!producto) {
            return res.status(200).json({
                ok: false,
                msg: 'El producto no existe en bodega, debe agregarlo ahí primero'
            });
        }

        // Descontamos la cantidad del producto en Bodega
        const productoBodega = await Bodega.findOne({
            where: { id_producto: producto.dataValues.id }
        });
        if (productoBodega.cantidad - cantidad < 0) {
            return res.status(200).json({
                ok: false,
                msg: 'No hay stock suficiente en bodega'
            });
        }
        productoBodega.cantidad -= cantidad;
        productoBodega.save();

        //buscamos el producto en inventario
        const FindProd = await Inventario.findOne({
            where:{
                id_producto:id
            }
        });
        if(FindProd){
            console.log(FindProd.cantidad);
            const newCantidad = FindProd.cantidad + parseInt(cantidad)
            console.log(newCantidad);
           const getProd =  await Inventario.update({
                
                cantidad: newCantidad,
                // cantidad_minima: 1
            },{
                where:{
                    id_producto: producto.dataValues.id,
                }
            });

        }
        else{
            // Guardamos el producto en Inventario
            await Inventario.create({
                id_producto: producto.dataValues.id,
                cantidad,
                cantidad_minima: 1
            });

        }      
        

        return res.status(200).json({
            ok: true,
            msg: 'Producto creado en inventario correctamente'
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: 'Ha ocurrido un error, por favor contacte al administrador'
        });
    }
};

const actualizarStockInventario = async (req, res = response) => {
    try {
        const { id_producto, cantidad } = req.body;
        const productoInventario = await Inventario.findOne({
            where: { id_producto }
        });
        productoInventario.cantidad = cantidad;
        productoInventario.save();
        return res.status(200).json({
            ok: true,
            msg: 'Stock en inventario actualizado correctamente'
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: 'Ha ocurrido un error, por favor contacte al administrador'
        });
    }
};

module.exports = {
    getInventario,
    crearProductoInventario,
    actualizarStockInventario
};
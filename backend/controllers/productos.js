const { response } = require('express');

const tipo_producto = require('../models/tipo_producto');
const Producto = require('../models/producto');
const Bodega = require('../models/bodega');
const Inventario = require('../models/inventario');
const Tipo_producto = require('../models/tipo_producto');


const crearProducto = async (req, res = response) => {
    try {
        const { product, price, category } = req.body;

        //busco si esta el producto
        const findProduct = await Producto.findOne({
            where: {
                nombre: product
            },
            attributes: ['id']
        });
        let findCategory = await tipo_producto.findOne({
            where: {
                tipo: category
            },
            attributes: ['id']
        });


        if (!findCategory) {
            const createCategory = await tipo_producto.create({
                tipo: category
            }, {
                fields: ['tipo'],
                attributes: ['id']

            });
            findCategory = createCategory;
            console.log('la categoria es: ', findCategory.id);
        }

        if (findProduct) {
            res.json({
                ok: false,
                msg: 'El producto ya existe, pruebe con otro nombre'
            });
        }
        else {
            //creo el producto
            const createProduct = await Producto.create({
                nombre: product,
                precio: price,
                id_tipo: findCategory.id

            }, {
                fields: ['nombre', 'precio', 'id_tipo']
            }
            );
            res.json({
                ok: true,
                msg: 'Producto creado con exito'
            });
        }

    }
    catch (error) {
        res.json({
            ok: false,
            msg: 'No se pudo crear el producto'
        });
    }

}

const findAllProductos = async (req, res = response) => {
    try {

        //busco si esta el producto
        const findAllProducts = await Producto.findAll({
            attributes: [
                'nombre', 'precio',
            ],
            include: [tipo_producto]
        });


    }
    catch (error) {
        res.json({
            ok: false,
            msg: 'No se pudo crear el producto'
        });
    }

}

const consultarProducto = async (req, res = response) => {
    try {
        const { id } = req.body;

        //busco si esta el producto
        const findProduct = await Producto.findOne({
            where: {
                id
            },
        });


    }
    catch (error) {
        res.json({
            ok: false,
            msg: 'No se pudo crear el producto'
        });
    }

};

const editarProducto = async (req, res = response) => {
    try {
        const { id, nombre, id_tipo, precio } = req.body;
        console.log(req.body)
        const producto = await Producto.findOne({
            where: { id }
        });
        producto.nombre = nombre;
        producto.id_tipo = id_tipo;
        producto.precio = precio;
        producto.save();

        return res.status(200).json({
            ok: true,
            msg: 'Producto actualiza correctamente'
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: 'Ha ocurrido un error, por favor contacte al administrador'
        });
    }
};

const eliminarProducto = async (req, res = response) => {
    try {
        const { id_producto } = req.body;

        // Buscamos cada registro de ese producto
        const producto = await Producto.findOne({
            where: { id: id_producto }
        });
        const productoBodega = await Bodega.findOne({
            where: { id_producto }
        });
        const productoInventario = await Inventario.findOne({
            where: { id_producto }
        });

        // Borramos
        productoInventario?.destroy();
        productoBodega?.destroy();
        producto?.destroy();

        return res.status(200).json({
            ok: true,
            msg: 'Producto eliminado correctamente'
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: 'Ha ocurrido un error, por favor contacte al administrador'
        });
    }
};

const obtenerTiposProducto = async (req, res = response) => {
    try {
        const tiposProducto = await Tipo_producto.findAll();
        return res.status(200).json({
            ok: true,
            msg: tiposProducto
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
    crearProducto,
    findAllProductos,
    consultarProducto,
    //eliminarProducto,
    //actualizarProducto,
    editarProducto,
    eliminarProducto,
    obtenerTiposProducto
};
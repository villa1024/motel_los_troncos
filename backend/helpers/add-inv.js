const Inventario = require("../models/inventario");

const addInv = async (id_producto, cantidad) => {
    const producto = await Inventario.findOne({
        where: { id: id_producto }
    });
    producto.cantidad += cantidad;
    await producto.save();
    return true;
};

module.exports = addInv;
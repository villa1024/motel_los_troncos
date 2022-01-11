const Inventario = require("../models/inventario");

const descInv = async (id_producto, cantidad) => {
    const producto = await Inventario.findOne({
        where: { id: id_producto }
    });
    if (producto.cantidad > cantidad) {
        producto.cantidad -= cantidad;
        await producto.save();
        return true;
    }
    else {
        return false
    }
};

module.exports = descInv;
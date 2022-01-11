const cantidad_extras = (extras) => {
    const temp = {};
    const final = [];
    for (let id_producto of extras) {
        temp[id_producto] = (temp[id_producto] || 0) + 1
    }
    for (let id_producto in temp) {
        final.push({
            id_producto: id_producto,
            cantidad: temp[id_producto]
        })
    }
    return final;
};

module.exports = cantidad_extras;
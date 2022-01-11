const { response } = require('express');
const jwt = require('jsonwebtoken');

const validarJWT = (req, res = response, next) => {
    // headers app-token
    const token = req.header('app-token');
    if (!token) {
        return res.status(401).json({
            ok: false,
            msg: 'No hay token en los headers'
        });
    }
    try {
        const { rut, tipo } = jwt.verify(token, process.env.SECRET_JWT_PASSWORD);
        req.rut = rut;
        req.tipo = tipo;
    } catch (error) {
        return res.status(401).json({
            ok: false,
            msg: 'Token no válido'
        });
    }
    next();
};

module.exports = {
    validarJWT
};
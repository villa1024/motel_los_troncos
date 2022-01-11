const { response } = require('express');
const jwt = require('jsonwebtoken');

const validarJWT = (req, res = response, next) => {
    const token = req.header('app-token');
    if (!token) {
        return res.status(401).json({
            ok: false,
            msg: 'No hay token'
        });
    }
    try {
        const payload = jwt.verify(
            token,
            process.env.SECRET_JWT_PASSWORD
        );
        req.rut_usuario = payload.rut;
        req.tipo = payload.tipo;
        req.id_usuario = payload.id_usuario
    } catch (error) {
        return res.status(401).json({
            ok: false,
            msg: 'Token no valido'
        });
    }
    next();
};

module.exports = validarJWT;
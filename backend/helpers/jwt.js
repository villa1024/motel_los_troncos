const jwt = require('jsonwebtoken');

const generarJWT = (rut, tipo, id_usuario) => {
    return new Promise((resolve, reject) => {
        const payload = { rut, tipo, id_usuario };
        jwt.sign(payload, process.env.SECRET_JWT_PASSWORD, {
            expiresIn: '1h'
        }, (err, token) => {
            if (err) {
                console.log(err);
                reject('No se pudo generar el token correspondiente');
            }
            resolve(token);
        });
    });
};

module.exports = {
    generarJWT
};
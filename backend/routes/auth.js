// host + /api/auth

const { Router } = require('express');
const { check } = require('express-validator');
const router = Router();

const { crearUsuario, loginUsuario, revalidarToken, eliminarUsuario, updateUsuario } = require('../controllers/auth');
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');

router.post(
    '/new',
    [
        check('nombre', 'El nombre es obligatorio').not().isEmpty(),
        check('apellido', 'El apellido es obligatorio').not().isEmpty(),
        check('rut', 'El rut es obligatorio').not().isEmpty(),
        check('correo', 'El correo es obligatorio').isEmail(),
        check('telefono', 'El telefono es obligatorio').not().isEmpty(),
        check('direccion', 'La direccion es obligatorio').not().isEmpty(),
        check('password', 'El password debe ser minimo de 5 caracteres').isLength({ min: 6 }),
        check('rol', 'El rol es obligatorio').not().isEmpty(),
        validarCampos
    ],
    crearUsuario
);

router.post(
    '/',
    [
        check('rut', 'El rut es obligatorio').not().isEmpty(),
        check('password', 'El password debe ser minimo de 5 caracteres').isLength({ min: 6 }),
        validarCampos
    ],
    loginUsuario
);

router.post(
    '/renew',
    [
        validarJWT
    ],
    revalidarToken
);

router.delete(
    '/deleteUser',
    eliminarUsuario
);


router.put(
    '/updateUser',
    updateUsuario
);

module.exports = router;
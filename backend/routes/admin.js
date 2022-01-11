// host + /api/auth

const { Router } = require('express');
const { check } = require('express-validator');
const router = Router();

const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');
const { verUsuarios, nuevoRol, obtenerRolesUsuarios } = require('../controllers/admin');
const { crearCliente, findClient, actualizarCliente } = require('../controllers/clientes');

router.get('/verUsuarios', verUsuarios);
router.post('/nuevoRol', nuevoRol);
router.get('/obtenerRolesUsuarios', obtenerRolesUsuarios);

router.post('/crearClient', crearCliente);
router.put('/updateClient', actualizarCliente);


module.exports = router;
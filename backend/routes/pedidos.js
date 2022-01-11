const { Router } = require('express');
const { check } = require('express-validator');
const router = Router();

// Middlewares

const { validarCampos } = require('../middlewares/validar-campos');
const validarJWT = require('../helpers/validar-jwt');
// Controllers
const { agregarPedido, eliminarPedido } = require('../controllers/pedidos');

router.post('/agregarPedido',validarJWT, agregarPedido);
router.post('/eliminarPedido',validarJWT, eliminarPedido);

module.exports = router;
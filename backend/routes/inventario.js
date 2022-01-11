// host + /api/auth

const { Router } = require('express');
const { check } = require('express-validator');
const router = Router();

const { getInventario, crearProductoInventario, actualizarStockInventario } = require('../controllers/inventario');

router.get('/getInventario', getInventario);
router.post('/crearProductoInventario', crearProductoInventario);
router.put('/actualizarStockInventario', actualizarStockInventario);

module.exports = router;
// host + /api/bodega

const { Router } = require('express');
const { check } = require('express-validator');
const router = Router();

const { getBodega, crearProductoBodega, actualizarStockBodega } = require('../controllers/bodega');

router.get('/getBodega', getBodega);
router.post('/crearProductoBodega', crearProductoBodega);
router.put('/actualizarStockBodega', actualizarStockBodega);

module.exports = router;
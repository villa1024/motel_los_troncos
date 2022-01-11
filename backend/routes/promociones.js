// host + /api/promociones

const { Router } = require('express');
const { check } = require('express-validator');
const router = Router();

const { getPromociones, crearPromocion, editarPromocion, eliminarPromocion } = require('../controllers/promociones');

router.get('/getPromociones', getPromociones);
router.post('/crearPromocion', crearPromocion);
router.put('/editarPromocion', editarPromocion);
router.delete('/eliminarPromocion', eliminarPromocion);

module.exports = router;
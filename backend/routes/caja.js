const { Router } = require('express');
const { check } = require('express-validator');
const router = Router();
const validarJWT = require('../helpers/validar-jwt');
const {newRetiro, newGasto, allGastos,cierreCaja,informacionCaja,allRetiros ,informacionMensual} = require('../controllers/caja');



router.post('/retiro',validarJWT, newRetiro);
router.post('/gasto',validarJWT, newGasto);
router.get('/allGastos', allGastos);
router.get('/allRetiros', allRetiros);
router.post('/cierre', cierreCaja);
router.get('/', informacionCaja);
router.get('/info', informacionMensual);



module.exports = router;
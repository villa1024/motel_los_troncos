// host + /api/auth

const { Router } = require("express");
const { check } = require("express-validator");
const router = Router();

const { validarCampos } = require("../middlewares/validar-campos");
const validarJWT = require("../helpers/validar-jwt");
const { agregarPromocion, eliminarPromocion } = require("../controllers/servicio_promocion");

router.post('/agregarPromocion', validarJWT, agregarPromocion);
router.delete('/eliminarPromocion', validarJWT, eliminarPromocion);

module.exports = router;

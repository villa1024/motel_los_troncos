// host + /api/auth

const { Router } = require("express");
const { check } = require("express-validator");
const router = Router();

const {
  reservarHabitacion,
  estadoHabitaciones,
  cancelarReserva,
  desalojarHabitacion,
  listarHabitaciones,
  habilitarHabitacion,
  listarPromociones,
  getServicio,
  calcularExtras,
  editarServicio,
  pruebaJWT,
  editarPromocion,
} = require("../controllers/servicio");

const { validarCampos } = require("../middlewares/validar-campos");
const validarJWT = require("../helpers/validar-jwt");

router.post("/reservarHabitacion", validarJWT, reservarHabitacion);

router.get("/state", estadoHabitaciones);

router.post("/cancel", validarJWT,cancelarReserva);

router.post("/desalojarHabitacion", validarJWT, desalojarHabitacion);
router.get("/", estadoHabitaciones);
router.get("/getService", getServicio);

router.get("/listarHabitaciones", listarHabitaciones);
router.put("/habilitarHabitacion", validarJWT, habilitarHabitacion);
router.get("/listarPromociones", validarJWT, listarPromociones);
router.get("/editarServicio", validarJWT, editarServicio);
router.put("/editarPromocion", validarJWT, editarPromocion);
// router.post(
//     '/',
//     [
//         check('rut', 'El rut es obligatorio').not().isEmpty(),
//         check('password', 'El password debe ser minimo de 5 caracteres').isLength({ min: 6 }),
//         validarCampos
//     ],
//     estadoHabitaciones
// );

// router.get(
//     '/renew',
//     [
//         validarJWT
//     ],
//     eliminarServicio
// );

// router.get(
//     '/find',
//     buscarServicio
// );

// router.put(
//     '/updateUser',
//     updateUsuario
// );

module.exports = router;

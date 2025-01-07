const express = require('express');
const router = express.Router();
const obtenerPuntuacion = require('../controllers/liga/obtenerPuntuacion');
const obtenerUsuarios = require('../controllers/liga/obtenerUsuarios');

router.post('/obtenerPuntuacion', obtenerPuntuacion.obtenerPuntuacion);
router.post('/obtenerUsuarios', obtenerUsuarios.obtenerUsuarios);

module.exports = router;
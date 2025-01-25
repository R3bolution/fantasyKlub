const express = require('express');
const router = express.Router();
const obtenerPuntuacion = require('../controllers/liga/obtenerPuntuacion');
const obtenerUsuarios = require('../controllers/liga/obtenerUsuarios');
const ligasUsuarios = require('../controllers/liga/ligasUsuarios');
const contarParticipantes = require('../controllers/liga/contarParticipantes');
const crearLiga = require('../controllers/liga/crearLiga');
const unirseLiga = require('../controllers/liga/unirseLiga');

router.post('/obtenerPuntuacion', obtenerPuntuacion.obtenerPuntuacion);
router.post('/obtenerUsuarios', obtenerUsuarios.obtenerUsuarios);
router.post('/ligasUsuarios', ligasUsuarios.ligasUsuarios);
router.post('/contarParticipantes', contarParticipantes.contarParticipantes);
router.post('/crearLiga', crearLiga.crearLiga);
router.post('/unirseLiga', unirseLiga.unirseLiga);

module.exports = router;
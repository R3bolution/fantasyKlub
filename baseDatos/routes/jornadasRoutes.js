const express = require('express');
const router = express.Router();
const obtenerJornadas = require('../controllers/obtenerJornadas');

router.post('/obtenerJornadas', obtenerJornadas.obtenerJornadas);

module.exports = router;
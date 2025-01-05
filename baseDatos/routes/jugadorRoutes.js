const express = require('express');
const router = express.Router();
const plantilla = require('../controllers/equipo/plantilla'); // Asegúrate de que la ruta sea correcta
const alineacion = require('../controllers/equipo/alineacion'); // Asegúrate de que la ruta sea correcta

// Ruta para consultar jugadores
router.post('/plantilla', plantilla.plantilla); // Usando el controlador de consulta de jugadores

// Ruta para consultar jugadores de acuerdo a los parámetros de la liga
router.post('/alineacion', alineacion.alineacion);

module.exports = router;

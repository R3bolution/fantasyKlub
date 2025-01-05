const express = require('express');
const router = express.Router();
const plantilla = require('../controllers/equipo/plantilla');
const alineacion = require('../controllers/equipo/alineacion'); 
const jugadorPorJornada = require('../controllers/equipo/jugadorPorJornada');


router.post('/plantilla', plantilla.plantilla); 

router.post('/alineacion', alineacion.alineacion);

router.post('/jugadorPorJornada', jugadorPorJornada.jugadorPorJornada);

module.exports = router;

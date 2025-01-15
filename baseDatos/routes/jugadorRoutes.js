const express = require('express');
const router = express.Router();
const plantilla = require('../controllers/equipo/plantilla');
const alineacion = require('../controllers/equipo/alineacion'); 
const jugadorPorJornada = require('../controllers/equipo/jugadorPorJornada');
const cambiarJugador = require('../controllers/equipo/cambiarJugador');
const obtenerReservados = require('../controllers/equipo/obtenerReservados');
const obtenerJugador = require('../controllers/equipo/obtenerJugador');


router.post('/plantilla', plantilla.plantilla); 

router.post('/alineacion', alineacion.alineacion);

router.post('/jugadorPorJornada', jugadorPorJornada.jugadorPorJornada);

router.post('/cambiarJugador', cambiarJugador.cambiarJugador);

router.post('/obtenerReservados', obtenerReservados.obtenerReservados);

router.post('/obtenerJugador', obtenerJugador.obtenerJugador);

module.exports = router;

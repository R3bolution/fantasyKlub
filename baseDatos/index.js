const express = require('express');
const cors = require('cors');
const app = express();
const bodyParser = require('body-parser');
const port = 3000;
require('dotenv').config();

// Configuración CORS para permitir solicitudes desde el frontend
app.use(cors());

// Middleware para parsear JSON
app.use(express.json());

const jugadoresRoutes = require('./routes/jugadorRoutes'); 
app.use('/api/jugadores', jugadoresRoutes);


// Inicia el servidor
app.listen(port, '0.0.0.0', () => {
  console.log(`Servidor corriendo en http://192.168.1.27:${port}`);
});

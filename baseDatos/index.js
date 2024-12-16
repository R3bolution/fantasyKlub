const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');
const app = express();
const port = 3000;

// Middleware para habilitar CORS (permitir solicitudes desde otros dominios)
app.use(cors());

// Conexión a la base de datos (ajusta la configuración a tus necesidades)
const dbConfig = {
  host: 'localhost', // Usa la IP de tu máquina si estás en una red local
  user: 'root',
  password: '', // Tu contraseña de MySQL
  database: 'prueba', // Nombre de la base de datos
};

// Ruta para obtener un usuario por nombre de usuario
app.get("/users/:username", async (req, res) => {
  const { username } = req.params;
  console.log('Solicitud recibida para el usuario:', username); // Verifica en la consola si llega la solicitud

  try {
    const connection = await mysql.createConnection(dbConfig);
    const [rows] = await connection.query('SELECT * FROM users WHERE username = ?', [username]);
    await connection.end();

    if (rows.length > 0) {
      res.json(rows[0]);
    } else {
      res.status(404).json({ message: "Usuario no encontrado" });
    }
  } catch (error) {
    console.error("Error al conectar con la base de datos:", error);
    res.status(500).json({ message: "Error en el servidor" });
  }
});

// Ruta principal para comprobar si el servidor está funcionando
app.get("/", (req, res) => {
  res.send("Servidor Express funcionando correctamente");
});

// Iniciar el servidor Express
app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});

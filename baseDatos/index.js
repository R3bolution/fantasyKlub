require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');
const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

// Conexión a la base de datos
const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
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

app.get("/", (req, res) => {
  res.send("Servidor Express funcionando correctamente");
});

// Iniciar el servidor Express
app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});

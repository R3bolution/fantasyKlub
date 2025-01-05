const mysql = require('mysql2/promise');
const dbConfig = require('../models/db'); // Asegúrate de que la ruta sea correcta

// Función para manejar las consultas de jugadores
const obtenerJornadas = async (req, res) => {
  const { UsuarioID, LigaID } = req.body; // Cambiar a req.query para obtener parámetros de la URL
  try {
    // Conexión a la base de datos
    const connection = await mysql.createConnection(dbConfig);

    // Consulta para obtener las jornadas
    const query = `
      SELECT jornada FROM Jornadas;
    `;
    const [rows] = await connection.query(query);
    await connection.end();

    // Responde con los resultados
    res.json(rows);
  } catch (error) {
    console.error("Error al conectar con la base de datos:", error);
    res.status(500).json({ message: "Error en el servidor" });
  }
};

// Exportar controlador
module.exports = { obtenerJornadas };

const mysql = require('mysql2/promise');
const dbConfig = require('../../models/db'); // Asegúrate de que la ruta sea correcta

// Función para manejar las consultas de jugadores
const alineacion = async (req, res) => {
  const { UsuarioLigaID } = req.body; // Cambiar a req.query para obtener parámetros de la URL

  // Validación de parámetros
  if (!UsuarioLigaID) {
    return res.status(400).json({ message: 'Faltan parámetros UsuarioID o LigaID' });
  }

  try {
    // Conexión a la base de datos
    const connection = await mysql.createConnection(dbConfig);

    // Consulta para obtener los jugadores alineados
    const query = `
      SELECT j.nombre,j.jugadorID
      FROM plantillas p 
      JOIN jugadores j ON p.JugadorID = j.JugadorID
      WHERE p.UsuarioLigaID = ? AND p.estado = 'ALINEADO';
    `;
    const [rows] = await connection.query(query, [UsuarioLigaID]);
    await connection.end();

    // Responde con los resultados
    res.json(rows);
  } catch (error) {
    console.error("Error al conectar con la base de datos:", error);
    res.status(500).json({ message: "Error en el servidor" });
  }
};

// Exportar controlador
module.exports = { alineacion };

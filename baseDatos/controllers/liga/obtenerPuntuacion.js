const mysql = require('mysql2/promise');
const dbConfig = require('../../models/db'); // Asegúrate de que la ruta sea correcta

// Función para manejar las consultas de jugadores
const obtenerPuntuacion = async (req, res) => {
  const { UsuarioLigaID, jornadaID, jornada } = req.body; // Cambiar a req.query para obtener parámetros de la URL


  try {
    // Conexión a la base de datos
    const connection = await mysql.createConnection(dbConfig);

    // Consulta para obtener los jugadores alineados
    const query = `
      SELECT p.puntos FROM Historial_Jugadores_Liga h
	JOIN Puntuaciones_Jugadores p ON h.JugadorID=p.JugadorID
	WHERE h.UsuarioLigaID = ? AND p.jornadaID=? AND h.jornada=?;
    `;
    const [rows] = await connection.query(query, [UsuarioLigaID, jornadaID, jornada]);
    await connection.end();

    // Responde con los resultados
    res.json(rows);
  } catch (error) {
    console.error("Error al conectar con la base de datos:", error);
    res.status(500).json({ message: "Error en el servidor" });
  }
};

// Exportar controlador
module.exports = { obtenerPuntuacion };

const mysql = require("mysql2/promise");
const dbConfig = require("../../models/db");

const pool = mysql.createPool(dbConfig);

const obtenerUltimaJornada = async (usuarioLigaID) => {
  const query = `
    SELECT MAX(jornada) AS ultimaJornada
    FROM historial_jugadores_liga
    WHERE usuarioLigaID = ?
  `;
  const [rows] = await pool.query(query, [usuarioLigaID]);
  return rows[0]?.ultimaJornada || 1; // Si no hay jornadas, por defecto es la jornada 1
};

const jugadorPorJornada = async (req, res) => {
  const { usuarioLigaID, jornada, JornadaID } = req.body; // Parámetros de la solicitud

  try {
    const connection = await pool.getConnection();

    // Si no se especifica jornada, obtener la última jornada
    const jornadaSeleccionada = jornada || await obtenerUltimaJornada(usuarioLigaID);

    // Consulta para obtener los jugadores y puntos por jornada
    const query = `
      SELECT j.Nombre, p.puntos 
      FROM historial_jugadores_liga h 
      JOIN Jugadores j ON h.JugadorID = j.JugadorID
      LEFT JOIN Puntuaciones_Jugadores p ON h.JugadorID = p.JugadorID AND p.JornadaID = ?
      WHERE h.usuarioLigaID = ? AND h.jornada = ?
    `;
    const queryParams = [JornadaID, usuarioLigaID, jornadaSeleccionada];

    const [rows] = await connection.query(query, queryParams);
    connection.release(); // Liberar la conexión

    // Responder con los resultados de la consulta, siempre devuelves la propiedad 'jugadores'
    return res.status(200).json({ jugadores: rows || [], jornada: jornadaSeleccionada });

  } catch (error) {
    console.error("Error al conectar con la base de datos:", error);
    return res
      .status(500)
      .json({ message: "Error en el servidor", error: error.message });
  }
};

// Exportar controlador
module.exports = { jugadorPorJornada };

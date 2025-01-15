const mysql = require('mysql2/promise');
const dbConfig = require('../../models/db'); // Asegúrate de que la ruta sea correcta

// Función para manejar las consultas de jugadores
const obtenerJugador = async (req, res) => {
  const { UsuarioLigaID, JugadorID } = req.body;

  // Validación de parámetros
  if (!UsuarioLigaID || !JugadorID) {
    return res.status(400).json({ message: 'Faltan parámetros UsuarioLigaID o JugadorID' });
  }

  try {
    // Conexión a la base de datos
    const connection = await mysql.createConnection(dbConfig);

    // Consulta para obtener los datos del jugador
    const query = `
        SELECT * FROM plantillas p
        JOIN jugadores j ON p.JugadorID = j.JugadorID
        WHERE p.UsuarioLigaID = ? AND p.JugadorID = ?;
    `;
    const [rows] = await connection.query(query, [UsuarioLigaID, JugadorID]);
    await connection.end();

    if (rows.length > 0) {
      res.json(rows[0]); // Devuelve el primer jugador como objeto
    } else {
      res.status(404).json({ message: 'Jugador no encontrado' });
    }
  } catch (error) {
    console.error('Error al conectar con la base de datos:', error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
};

// Exportar controlador
module.exports = { obtenerJugador };

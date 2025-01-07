const mysql = require('mysql2/promise');
const dbConfig = require('../../models/db'); // Asegúrate de que la ruta sea correcta

// Función para manejar las consultas de jugadores
const obtenerUsuarios = async (req, res) => {
  const { LigaID } = req.body; // Cambiar a req.query para obtener parámetros de la URL


  try {
    // Conexión a la base de datos
    const connection = await mysql.createConnection(dbConfig);

    // Consulta para obtener los jugadores alineados
    const query = `
      SELECT ul.UsuarioLigaID, u.nombre FROM ligas l
	    JOIN Usuarios_Ligas ul ON l.LigaID=ul.LigaID
      JOIN usuarios u ON ul.UsuarioID=u.UsuarioID
	    WHERE l.LigaID=?;
      `;
    const [rows] = await connection.query(query, [LigaID]);
    await connection.end();

    // Responde con los resultados
    res.json(rows);
  } catch (error) {
    console.error("Error al conectar con la base de datos:", error);
    res.status(500).json({ message: "Error en el servidor" });
  }
};

// Exportar controlador
module.exports = { obtenerUsuarios };

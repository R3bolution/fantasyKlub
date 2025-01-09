const mysql = require('mysql2/promise');
const dbConfig = require('../../models/db'); // Asegúrate de que la ruta sea correcta

// Función para manejar las consultas de jugadores
const ligasUsuarios = async (req, res) => {
  const { UsuarioID } = req.body; // Cambiar a req.query para obtener parámetros de la URL


  try {
    // Conexión a la base de datos
    const connection = await mysql.createConnection(dbConfig);

    // Consulta para obtener los jugadores alineados
    const query = `
      SELECT ul.UsuarioLigaID,ul.LigaID,l.nombre FROM usuarios_ligas ul
        JOIN ligas l ON ul.ligaID=l.LigaID
        WHERE ul.UsuarioID=?;
      `;
    const [rows] = await connection.query(query, [UsuarioID]);
    await connection.end();

    // Responde con los resultados
    res.json(rows);
  } catch (error) {
    console.error("Error al conectar con la base de datos:", error);
    res.status(500).json({ message: "Error en el servidor" });
  }
};

// Exportar controlador
module.exports = { ligasUsuarios };

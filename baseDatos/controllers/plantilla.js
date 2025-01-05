const mysql = require('mysql2/promise');
const dbConfig = require('../models/db'); // Importa la configuración de la base de datos

// Crea un pool de conexiones para mejorar el rendimiento
const pool = mysql.createPool(dbConfig);

// Función para manejar las consultas de jugadores
const plantilla = async (req, res) => {
  const { tipoConsulta, params } = req.body;
  
  try {
    // Usamos el pool para obtener una conexión
    const connection = await pool.getConnection();

    let query;
    let queryParams;

    // Selecciona la consulta a ejecutar dependiendo del tipo
    switch (tipoConsulta) {
      case 'jugadores':
        query = `
          SELECT j.JugadorID, j.nombre, j.deporte, j.posicion 
          FROM plantillas p 
          JOIN jugadores j ON p.JugadorID = j.JugadorID 
          JOIN usuarios_ligas ul ON p.UsuarioLigaID = ul.UsuarioLigaID 
          WHERE ul.UsuarioID = ? AND ul.LigaID = ?;
        `;
        queryParams = [params.UsuarioID, params.LigaID];
        break;

      case 'jugadorPorId':
        query = 'SELECT * FROM Jugadores WHERE JugadorID = ?';
        queryParams = [params.JugadorID];
        break;

      default:
        return res.status(400).json({ message: 'Consulta no válida' });
    }

    // Ejecuta la consulta
    const [rows] = await connection.query(query, queryParams);
    connection.release();  // Liberamos la conexión al pool

    // Si no se encuentra resultados
    if (rows.length === 0) {
      return res.status(404).json({ message: 'No se encontraron jugadores' });
    }

    // Responde con los resultados
    res.json(rows);
  } catch (error) {
    console.error("Error al conectar con la base de datos:", error);  // Imprimir error detallado
    res.status(500).json({ message: "Error en el servidor", error: error.message });
  }
};

// Exportar controlador
module.exports = {plantilla};

const mysql = require('mysql2/promise');
const dbConfig = require('../../models/db'); // Asegúrate de que la ruta sea correcta

// Función para manejar las consultas de jugadores
const cambiarJugador = async (req, res) => {
  const { UsuarioLigaID, JugadorID1, JugadorID2 } = req.body; // Cambiar a req.query si los parámetros llegan por URL

  // Validación de parámetros
  if (!UsuarioLigaID || !JugadorID1 || !JugadorID2) {
    return res.status(400).json({ message: 'Faltan parámetros UsuarioLigaID, JugadorID1 o JugadorID2' });
  }

  try {
    // Conexión a la base de datos
    const connection = await mysql.createConnection(dbConfig);

    // Consultas para cambiar estados de los jugadores
    const queryAlinear = `
      UPDATE plantillas SET estado = 'ALINEADO' WHERE UsuarioLigaID = ? AND JugadorID = ?;
    `;
    const queryReservar = `
      UPDATE plantillas SET estado = 'RESERVADO' WHERE UsuarioLigaID = ? AND JugadorID = ?;
    `;

    // Ejecutar las consultas
    const [resultAlinear] = await connection.query(queryAlinear, [UsuarioLigaID, JugadorID1]);
    const [resultReservar] = await connection.query(queryReservar, [UsuarioLigaID, JugadorID2]);

    // Cerrar conexión
    await connection.end();

    // Responder con los resultados combinados
    res.json({
      message: 'Actualización realizada con éxito',
      alinear: resultAlinear,
      reservar: resultReservar,
    });
  } catch (error) {
    console.error("Error al conectar con la base de datos:", error);
    res.status(500).json({ message: "Error en el servidor", error });
  }
};

// Exportar controlador
module.exports = { cambiarJugador };

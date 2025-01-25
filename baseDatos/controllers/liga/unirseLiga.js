const mysql = require("mysql2/promise");
const dbConfig = require("../../models/db"); // Asegúrate de que la ruta sea correcta

// Función para unirse a una liga
const unirseLiga = async (req, res) => {
  const { CodigoLiga, UsuarioID } = req.body; // Datos necesarios para unirse a la liga

  try {
    // Conexión a la base de datos
    const connection = await mysql.createConnection(dbConfig);

    // Comprobar si el código de liga existe
    const [ligaRows] = await connection.query(
      "SELECT LigaID FROM Ligas WHERE Codigo = ?",
      [CodigoLiga]
    );

    if (ligaRows.length === 0) {
      return res.status(400).json({ message: "El código de liga no existe." });
    }

    const LigaID = ligaRows[0].LigaID;

    // Contar cuántos participantes hay en la liga
    const [participantesRows] = await connection.query(
      "SELECT COUNT(*) AS total FROM Usuarios_Ligas WHERE LigaID = ?",
      [LigaID]
    );

    if (participantesRows[0].total >= 4) {
      return res.status(400).json({ message: "La liga ya tiene el número máximo de participantes." });
    }

    // Verificar si el usuario ya es parte de la liga
    const [usuarioExistente] = await connection.query(
      "SELECT * FROM Usuarios_Ligas WHERE UsuarioID = ? AND LigaID = ?",
      [UsuarioID, LigaID]
    );

    if (usuarioExistente.length > 0) {
      return res.status(400).json({ message: "Ya estás en esta liga." });
    }

    // Insertar al usuario en la tabla Usuarios_Ligas
    const [userLigaResult] = await connection.query(
      "INSERT INTO Usuarios_Ligas (UsuarioID, LigaID) VALUES (?, ?)",
      [UsuarioID, LigaID]
    );

    const UsuarioLigaID = userLigaResult.insertId; // Obtener el UsuarioLigaID recién creado

    // Seleccionar 4 jugadores aleatorios que no estén asignados a otro usuario en la misma liga
    const [jugadores] = await connection.query(
      `
      SELECT * FROM jugadores
      WHERE NOT EXISTS (
          SELECT 1 
          FROM usuarios_ligas ul
          JOIN plantillas p ON ul.UsuarioLigaID = p.UsuarioLigaID
          WHERE ul.ligaID = ? AND p.JugadorID = jugadores.JugadorID
      )
      ORDER BY RAND() 
      LIMIT 4
      `,
      [LigaID]
    );

    // Asegurarse de que hemos recibido 4 jugadores
    if (jugadores.length !== 4) {
      return res.status(400).json({ message: "No se encontraron suficientes jugadores disponibles" });
    }

    // Asignar estado a los jugadores (3 alineados y 1 en reserva)
    jugadores.forEach(async (jugador, index) => {
      const estado = index < 3 ? 'ALINEADO' : 'RESERVADO'; // Los primeros 3 jugadores alineados, el 4º en reserva

      await connection.query(
        "INSERT INTO plantillas (UsuarioLigaID, JugadorID, Estado) VALUES (?, ?, ?)",
        [UsuarioLigaID, jugador.JugadorID, estado]
      );
    });

    // Cerrar conexión
    await connection.end();

    // Responder con éxito
    res.json({
      message: "Te has unido a la liga exitosamente y se te asignaron jugadores",
    });
  } catch (error) {
    console.error("Error al conectar con la base de datos:", error);
    res.status(500).json({ message: "Error en el servidor" });
  }
};

// Exportar controlador
module.exports = { unirseLiga };

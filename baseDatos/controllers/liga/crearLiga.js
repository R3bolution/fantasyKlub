const mysql = require("mysql2/promise");
const dbConfig = require("../../models/db"); // Asegúrate de que la ruta sea correcta

// Función para crear una nueva liga
const crearLiga = async (req, res) => {
  const { Nombre, UsuarioID } = req.body; // Datos necesarios para crear la liga

  try {
    // Conexión a la base de datos
    const connection = await mysql.createConnection(dbConfig);

    let codigo = generarCodigoAleatorio();
    let codigoUnico = false;

    // Verificar que el código sea único
    while (!codigoUnico) {
      const [rows] = await connection.query(
        "SELECT COUNT(*) AS total FROM Ligas WHERE Codigo = ?",
        [codigo]
      );

      if (rows[0].total === 0) {
        codigoUnico = true; // El código es único
      } else {
        codigo = generarCodigoAleatorio(); // Generar un nuevo código si ya existe
      }
    }

    // Insertar la nueva liga en la tabla Ligas
    const [result] = await connection.query(
      "INSERT INTO Ligas (Nombre, Codigo) VALUES (?, ?)",
      [Nombre, codigo]
    );

    const LigaID = result.insertId; // ID de la liga recién creada

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
      message: "Liga creada y jugadores asignados exitosamente",
      LigaID,
      Codigo: codigo,
      JugadoresAsignados: jugadores,
    });
  } catch (error) {
    console.error("Error al conectar con la base de datos:", error);
    res.status(500).json({ message: "Error en el servidor" });
  }
};

// Función para generar un código aleatorio único
const generarCodigoAleatorio = () => {
  const caracteres = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let codigo = "";
  for (let i = 0; i < 6; i++) {
    codigo += caracteres.charAt(Math.floor(Math.random() * caracteres.length));
  }
  return codigo;
};

// Exportar controlador
module.exports = { crearLiga };

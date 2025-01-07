const bcrypt = require('bcrypt');
const mysql = require('mysql2/promise');  // Usamos mysql2 que soporta promesas
const dbConfig = require('../../models/db');  // Asegúrate de que este archivo contiene la configuración correcta de la DB

// Establecer el pool de conexiones, usando mysql2 que soporta promesas
const pool = mysql.createPool(dbConfig);  // Usamos un pool de conexiones en vez de crear una nueva conexión cada vez

const registerUser = async (req, res) => {
  const { nombre, correo, contraseña } = req.body;

  try {
    // Verifica si el correo ya existe en la base de datos
    const [results] = await pool.query('SELECT * FROM Usuarios WHERE Correo = ?', [correo]);

    if (results.length > 0) {
      return res.status(400).json({ message: 'El correo ya está registrado' });
    }

    // Encriptar la contraseña
    const hashedPassword = await bcrypt.hash(contraseña, 10);  // Encripta la contraseña con 10 salt rounds

    // Registrar al nuevo usuario
    await pool.query(
      'INSERT INTO Usuarios (Nombre, Correo, ContraseñaHash, Estado) VALUES (?, ?, ?, ?)',
      [nombre, correo, hashedPassword, 'ACTIVO']
    );

    res.status(201).json({ message: 'Usuario registrado exitosamente' });
  } catch (err) {
    console.error(err);  // Agrega un log para poder revisar el error
    res.status(500).json({ message: 'Ocurrió un error al registrar al usuario' });
  }
};

module.exports = { registerUser };

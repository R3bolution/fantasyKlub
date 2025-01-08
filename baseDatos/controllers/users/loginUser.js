const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');  // Necesitarás instalar jwt
const mysql = require('mysql2/promise');
const dbConfig = require('../../models/db');  // Asegúrate de que este archivo contiene la configuración correcta de la DB

// Establecer el pool de conexiones
const pool = mysql.createPool(dbConfig);

const loginUser = async (req, res) => {
  const { correo, contraseña } = req.body;  // Asegúrate de que el nombre del campo sea 'correo' y 'contraseña'

  try {
    // Verifica si el correo existe en la base de datos
    const [results] = await pool.query('SELECT * FROM Usuarios WHERE Correo = ?', [correo]);

    if (results.length === 0) {
      return res.status(400).json({ message: 'Credenciales incorrectas' });
    }

    const user = results[0];

    // Compara la contraseña proporcionada con la almacenada (encriptada) en la base de datos
    const isPasswordValid = await bcrypt.compare(contraseña, user.ContraseñaHash);

    if (!isPasswordValid) {
      return res.status(400).json({ message: 'Credenciales incorrectas' });
    }

    // Si la contraseña es válida, generamos un token JWT
    const token = jwt.sign(
      { userId: user.UsuarioID, correo: user.Correo },  // Aquí puedes incluir más datos si es necesario
      'your_secret_key',  // Asegúrate de usar una clave secreta segura y privada
      { expiresIn: '1h' }  // El token expirará en 1 hora
    );

    // Enviar el token en la respuesta
    res.json({ 
      token,
      userId: user.UsuarioID
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Ocurrió un error al intentar iniciar sesión' });
  }
};

module.exports = { loginUser };

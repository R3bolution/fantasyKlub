// Configuración de la base de datos
require('dotenv').config(); // Cargar las variables de entorno desde .env

module.exports = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  port: process.env.DB_PORT || 3306,
};

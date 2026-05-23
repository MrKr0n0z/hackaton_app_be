const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

// Comprobación rápida al iniciar
pool.connect()
  .then(() => console.log('✅ Conectado a la base de datos PostgreSQL (con PostGIS)'))
  .catch(err => console.error('❌ Error conectando a la base de datos:', err.message));

module.exports = {
  // Exportamos un método para ejecutar queries fácilmente en nuestros controladores
  query: (text, params) => pool.query(text, params),
};
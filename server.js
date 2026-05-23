const express = require('express');
const cors = require('cors');
require('dotenv').config();
const db = require('./src/config/db'); 

// Importamos las rutas que acabamos de crear
const authRoutes = require('./src/routes/authRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json()); 

// AQUÍ ES DONDE NACE LA RUTA: Le decimos a la API que use /api/auth
app.use('/api/auth', authRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'BasurApp API funcionando 🚀' });
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
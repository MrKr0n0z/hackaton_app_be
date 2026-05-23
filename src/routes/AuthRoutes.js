const express = require('express');
const router = express.Router();
// Ojo: Asegúrate de que el nombre del archivo del controlador coincida exactamente
const authController = require('../controllers/authController');

// Aquí se crea la ruta /register
router.post('/register', authController.register);
router.post('/login', authController.login);

module.exports = router;
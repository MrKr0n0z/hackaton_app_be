const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../config/db');

// Registro de usuario
exports.register = async (req, res) => {
  const { email, phone, password } = req.body;

  try {
    const userExists = await db.query('SELECT * FROM users WHERE email = $1 OR phone = $2', [email, phone]);
    if (userExists.rows.length > 0) {
      return res.status(400).json({ error: 'El correo o teléfono ya están registrados' });
    }

    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    const newUser = await db.query(
      'INSERT INTO users (email, phone, password_hash) VALUES ($1, $2, $3) RETURNING id, email, phone',
      [email, phone, passwordHash]
    );

    res.status(201).json({ message: 'Usuario registrado exitosamente', user: newUser.rows[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error en el servidor al registrar usuario' });
  }
};

// Login de usuario
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const result = await db.query('SELECT * FROM users WHERE email = $1', [email]);
    const user = result.rows[0];

    if (!user) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    const isValidPassword = await bcrypt.compare(password, user.password_hash);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET || 'super_secreto_basurapp_123', {
      expiresIn: '7d'
    });

    res.json({ message: 'Login exitoso', token, user: { id: user.id, email: user.email } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error en el servidor al hacer login' });
  }
};
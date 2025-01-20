require('dotenv').config();
const express = require('express');
const mysql = require('mysql2/promise');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Configuración de la conexión a la base de datos
const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT
};

// Ruta para iniciar sesión
app.post('/login', async (req, res) => {
  const { NombreUsuario, Contrasena } = req.body;

  if (!NombreUsuario || !Contrasena) {
    return res.status(400).json({ error: 'Por favor, proporcione NombreUsuario y Contrasena.' });
  }

  try {
    const connection = await mysql.createConnection(dbConfig);
    const [rows] = await connection.execute(
      'SELECT * FROM Usuarios WHERE NombreUsuario = ? AND Contrasena = ?',
      [NombreUsuario, Contrasena]
    );
    await connection.end();

    if (rows.length > 0) {
      return res.status(200).json({ message: 'Inicio de sesión exitoso', user: rows[0] });
    } else {
      return res.status(401).json({ error: 'Credenciales incorrectas' });
    }
  } catch (error) {
    console.error('Error al conectar a la base de datos:', error);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
});


app.post('/register', async (req, res) => {
  const { NombreUsuario, Contrasena } = req.body;

  if (!NombreUsuario || !Contrasena) {
    return res.status(400).json({ error: 'Por favor, proporcione NombreUsuario y Contrasena.' });
  }

  try {
    const connection = await mysql.createConnection(dbConfig);

    // Inserta el nuevo usuario en la base de datos
    const [result] = await connection.execute(
      'INSERT INTO Usuarios (NombreUsuario, Contrasena) VALUES (?, ?)',
      [NombreUsuario, Contrasena]
    );
    await connection.end();

    return res.status(201).json({ message: 'Usuario registrado exitosamente', userId: result.insertId });
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ error: 'El nombre de usuario ya está en uso' });
    }
    console.error('Error al registrar usuario:', error);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
});


// Iniciar el servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

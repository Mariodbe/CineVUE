// index.js

const express = require('express');
const cors = require('cors');
const oracledb = require('oracledb');
const dotenv = require('dotenv');

dotenv.config(); // Cargar las variables de entorno desde .env

const app = express();

// Configuración de la conexión a la base de datos (Oracle)
const dbConfig = {
  user: process.env.DB_USER,         // Usuario de la base de datos
  password: process.env.DB_PASSWORD, // Contraseña de la base de datos
  connectString: process.env.DB_HOST, // 'localhost:1521/xe' o la cadena que estés utilizando
  externalAuth: false,               // Establecer esto en false si no usas autenticación externa
  stmtCacheSize: 1000                // Opcional, para mejorar el rendimiento en ciertas consultas
};

app.use(express.json()); // Middleware para parsear el cuerpo de la solicitud como JSON
app.use(cors()); // Habilitar CORS para todas las solicitudes

// Ruta para iniciar sesión
app.post('/login', async (req, res) => {
  const { NombreUsuario, Contrasena } = req.body;

  if (!NombreUsuario || !Contrasena) {
    return res.status(400).json({ error: 'Por favor, proporcione NombreUsuario y Contrasena.' });
  }

  let connection;
  try {
    // Crear la conexión a Oracle
    const connection = await oracledb.getConnection(dbConfig);

    const result = await connection.execute(
      'SELECT * FROM Usuarios WHERE NombreUsuario = :nombreUsuario AND Contrasena = :contrasena', 
      { nombreUsuario: NombreUsuario, contrasena: Contrasena } // Usamos bind variables para evitar inyecciones SQL
    );

    if (result.rows.length > 0) {
      return res.status(200).json({ message: 'Inicio de sesión exitoso', user: result.rows[0] });
    } else {
      return res.status(401).json({ error: 'Credenciales incorrectas' });
    }
  } catch (error) {
    console.error('Error al conectar a la base de datos:', error);
    return res.status(500).json({ error: 'Error interno del servidor' });
  } finally {
    if (connection) {
      try {
        await connection.close(); // Asegurarse de cerrar la conexión
      } catch (err) {
        console.error('Error al cerrar la conexión:', err);
      }
    }
  }
});

// Ruta para registrar un nuevo usuario
app.post('/register', async (req, res) => {
  const { NombreUsuario, Contrasena } = req.body;

  if (!NombreUsuario || !Contrasena) {
    return res.status(400).json({ error: 'Por favor, proporcione NombreUsuario y Contrasena.' });
  }

  let connection;
  try {
    // Crear la conexión a Oracle
    connection = await oracledb.getConnection(dbConfig);

    // Insertar el nuevo usuario en la base de datos
    const result = await connection.execute(
      'INSERT INTO Usuarios (NombreUsuario, Contrasena) VALUES (:nombreUsuario, :contrasena)',
      { nombreUsuario: NombreUsuario, contrasena: Contrasena },
      { autoCommit: true } // Auto-confirmar la transacción
    );

    return res.status(201).json({ message: 'Usuario registrado exitosamente', userId: result.lastRowid });
  } catch (error) {
    if (error.code === 'ORA-00001') { // Código de error para entradas duplicadas (clave primaria duplicada)
      return res.status(409).json({ error: 'El nombre de usuario ya está en uso' });
    }
    console.error('Error al registrar usuario:', error);
    return res.status(500).json({ error: 'Error interno del servidor' });
  } finally {
    if (connection) {
      try {
        await connection.close(); // Asegurarse de cerrar la conexión
      } catch (err) {
        console.error('Error al cerrar la conexión:', err);
      }
    }
  }
});

// Función para validar la tarjeta
async function validateCard(cardNumber, expiryDate, cvv) {
  let connection;
  try {
    connection = await oracledb.getConnection(dbConfig);

    // Consulta para validar la tarjeta
    const query = `
      SELECT * FROM tarjetas
      WHERE numero_tarjeta = :cardNumber
      AND fecha_vencimiento = :expiryDate
      AND cvv = :cvv
    `;

    const result = await connection.execute(query, {
      cardNumber: cardNumber,
      expiryDate: expiryDate,
      cvv: cvv,
    });

    if (result.rows.length > 0) {
      console.log('Tarjeta válida');
      return { success: true, message: 'Tarjeta válida' };
    } else {
      console.log('Datos de tarjeta incorrectos');
      return { success: false, message: 'Datos de tarjeta incorrectos' };
    }
  } catch (error) {
    console.error('Error al validar la tarjeta:', error);
    return { success: false, message: 'Error al procesar la tarjeta' };
  } finally {
    if (connection) {
      try {
        await connection.close(); // Cerrar la conexión
      } catch (err) {
        console.error('Error al cerrar la conexión:', err);
      }
    }
  }
}

// Ruta para procesar el pago
// Ruta para procesar el pago y registrar la reserva
app.post('/process-payment', async (req, res) => {
  const { cardNumber, expiryDate, cvv, pelicula, hora_funcion, asientos, cantidad_entradas, UsuarioID } = req.body;

  if (!cardNumber || !expiryDate || !cvv || !pelicula || !hora_funcion || !asientos || !cantidad_entradas || !UsuarioID) {
    return res.status(400).json({ success: false, message: 'Datos incompletos' });
  }

  // Validar tarjeta
  const validationResult = await validateCard(cardNumber, expiryDate, cvv);

  if (!validationResult.success) {
    return res.status(400).json(validationResult);
  }

  let connection;
  try {
    connection = await oracledb.getConnection(dbConfig);

    // Insertar la reserva en la tabla 'reservas'
    const insertQuery = `
      INSERT INTO reservas (pelicula, hora_funcion, asientos, cantidad_entradas, UsuarioID)
      VALUES (:pelicula, TO_TIMESTAMP(:hora_funcion, 'YYYY-MM-DD HH24:MI:SS'), :asientos, :cantidad_entradas, :UsuarioID)
    `;
    await connection.execute(
      insertQuery,
      {
        pelicula,
        hora_funcion, // Formato: 'YYYY-MM-DD HH24:MI:SS'
        asientos,
        cantidad_entradas,
        UsuarioID,
      },
      { autoCommit: true } // Confirmar la transacción automáticamente
    );

    return res.status(200).json({ success: true, message: 'Pago y reserva procesados correctamente' });
  } catch (error) {
    console.error('Error al procesar la reserva:', error);
    return res.status(500).json({ success: false, message: 'Error interno del servidor' });
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error('Error al cerrar la conexión:', err);
      }
    }
  }
});


// Iniciar servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

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




app.post('/validate-card', async (req, res) => {
  const { cardNumber, expiryDate, cvv } = req.body;

  if (!cardNumber || !expiryDate || !cvv) {
    return res.status(400).json({ error: 'Por favor, proporcione número de tarjeta, fecha de vencimiento y CVV.' });
  }

  let connection;
  try {
    // Crear la conexión a Oracle
    connection = await oracledb.getConnection(dbConfig);

    // Consulta SQL para validar la tarjeta usando variables vinculadas
    const result = await connection.execute(
      `SELECT * FROM tarjetas 
       WHERE NUMERO_TARJETA = :cardNumber 
       AND FECHA_VENCIMIENTO = :expiryDate 
       AND CVV = :cvv`,
      {
        cardNumber: cardNumber,  // Número de tarjeta
        expiryDate: expiryDate,  // Fecha de caducidad
        cvv: cvv                 // CVV
      }
    );

    if (result.rows.length > 0) {
      // Si se encuentra una tarjeta que coincida
      return res.status(200).json({ message: 'Tarjeta válida' });
    } else {
      // Si no se encuentra ninguna coincidencia
      return res.status(400).json({ error: 'Datos de tarjeta incorrectos' });
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







// Ruta para guardar los asientos seleccionados
app.post('/reservar', async (req, res) => {
  const { peliculaId, horaFuncion, asientosSeleccionados } = req.body; // Datos enviados desde el frontend

  if (!peliculaId || !horaFuncion || !asientosSeleccionados || asientosSeleccionados.length === 0) {
    return res.status(400).json({ error: 'Faltan datos para completar la reserva' });
  }

  let connection;
  try {
    // Crear la conexión a Oracle
    connection = await oracledb.getConnection(dbConfig);

    // Preparar la consulta SQL para insertar los asientos reservados
    const sqlInsert = `
      INSERT INTO asientos (pelicula_id, hora_funcion, asiento, estado)
      VALUES (:peliculaId, :horaFuncion, :asiento, 1)`; // 1 indica que el asiento está reservado

    // Ejecutar la consulta para cada asiento seleccionado
    for (let asiento of asientosSeleccionados) {
      await connection.execute(sqlInsert, {
        peliculaId: peliculaId,
        horaFuncion: horaFuncion,
        asiento: asiento
      });
    }

    // Confirmar cambios
    await connection.commit();

    return res.status(200).json({ message: 'Reserva realizada con éxito' });
  } catch (error) {
    console.error('Error al realizar la reserva:', error);
    return res.status(500).json({ error: 'Error al realizar la reserva' });
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

app.post('/obtenerAsientosReservados', async (req, res) => {
  const { peliculaId, horaFuncion } = req.body;

  if (!peliculaId || !horaFuncion) {
    return res.status(400).json({ error: 'Faltan datos para obtener los asientos reservados' });
  }

  let connection;
  try {
    // Crear la conexión a Oracle
    connection = await oracledb.getConnection(dbConfig);

    // Consulta SQL para obtener los asientos reservados
    const sql = `
      SELECT asiento
      FROM asientos
      WHERE pelicula_id = :peliculaId AND hora_funcion = :horaFuncion AND estado = 1
    `;

    // Ejecutar la consulta
    const result = await connection.execute(sql, {
      peliculaId: peliculaId,
      horaFuncion: horaFuncion
    });

    // Obtener los asientos reservados
    const asientosReservados = result.rows.map(row => row[0]);

    return res.status(200).json({ asientosReservados });
  } catch (error) {
    console.error('Error al obtener los asientos reservados:', error);
    return res.status(500).json({ error: 'Error al obtener los asientos reservados' });
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


// Iniciar servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

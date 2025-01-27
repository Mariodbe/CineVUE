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
app.post('/registrarse', async (req, res) => {
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







// Ruta para guardar los asientos seleccionados y la reserva
app.post('/reservar', async (req, res) => {
  const { peliculaId, horaFuncion, asientosSeleccionados } = req.body;
  let { usuarioId } = req.body;

  // Forzar usuarioId a 1 si no está definido
  if (!usuarioId) {
    console.warn('Advertencia: usuarioId no definido. Forzando a 1.');
    usuarioId = 1;
  }

  // Verificar los datos recibidos
  console.log('Datos recibidos:', { peliculaId, horaFuncion, asientosSeleccionados, usuarioId });

  if (!peliculaId || !horaFuncion || !asientosSeleccionados || asientosSeleccionados.length === 0 || !usuarioId) {
    console.error('Error: Faltan datos para completar la reserva');
    return res.status(400).json({ error: 'Faltan datos para completar la reserva' });
  }

  let connection;
  try {
    // Crear la conexión a Oracle
    connection = await oracledb.getConnection(dbConfig);
    console.log('Conexión a la base de datos establecida');

    // Insertar asientos reservados en la tabla "asientos"
    const sqlInsertAsientos = `
      INSERT INTO asientos (pelicula_id, hora_funcion, asiento, estado)
      VALUES (:peliculaId, :horaFuncion, :asiento, 1)`;

    console.log('Preparando para insertar asientos:', asientosSeleccionados);

    for (let asiento of asientosSeleccionados) {
      console.log(`Insertando asiento ${asiento} para película ID ${peliculaId} y hora ${horaFuncion}`);
      await connection.execute(sqlInsertAsientos, {
        peliculaId,
        horaFuncion, // Usar la hora como VARCHAR ("19:45")
        asiento,
      });
    }

    // Insertar reserva en la tabla "reservas"
    const sqlInsertReserva = `
      INSERT INTO reservas (pelicula, hora_funcion, asientos, cantidad_entradas, usuarioid)
      VALUES (:peliculaTitulo, :horaFuncion, :asientos, :cantidadEntradas, :usuarioId)`;

    console.log('Buscando título de la película para películaId:', peliculaId);

    const peliculaResult = await connection.execute(
      'SELECT titulo FROM peliculas WHERE PeliculaID = :peliculaId',
      { peliculaId }
    );

    if (!peliculaResult.rows || peliculaResult.rows.length === 0) {
      console.error('Error: No se encontró la película con el ID proporcionado');
      return res.status(404).json({ error: 'Película no encontrada' });
    }

    const peliculaTitulo = peliculaResult.rows[0][0]; // Obtener el título de la película
    console.log('Título de la película encontrado:', peliculaTitulo);

    console.log('Insertando la reserva en la tabla "reservas"');
    await connection.execute(sqlInsertReserva, {
      peliculaTitulo,
      horaFuncion, // Usar la hora como VARCHAR ("19:45")
      asientos: asientosSeleccionados.join(', '), // Guardar los asientos como una lista separada por comas
      cantidadEntradas: asientosSeleccionados.length, // Número de entradas es igual a la cantidad de asientos seleccionados
      usuarioId,
    });

    // Confirmar los cambios en la base de datos
    console.log('Confirmando los cambios en la base de datos...');
    await connection.commit();

    console.log('Reserva realizada con éxito');
    return res.status(200).json({ message: 'Reserva realizada con éxito' });
  } catch (error) {
    console.error('Error al realizar la reserva:', error);
    return res.status(500).json({ error: 'Error al realizar la reserva' });
  } finally {
    if (connection) {
      try {
        console.log('Cerrando la conexión a la base de datos...');
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

app.get('/reservas', async (req, res) => {
  const usuarioId = 1; // Forzamos el usuarioId a ser 1 directamente

  let connection;
  try {
    // Crear la conexión a Oracle
    connection = await oracledb.getConnection(dbConfig);

    // Consulta SQL para obtener las reservas del usuario
    const sql = `
      SELECT ID, PELICULA, HORA_FUNCION, ASIENTOS, CANTIDAD_ENTRADAS, FECHA_RESERVA
      FROM reservas
      WHERE USUARIOID = :usuarioId
      ORDER BY FECHA_RESERVA DESC
    `;

    // Ejecutar la consulta
    const result = await connection.execute(sql, { usuarioId });

    // Si el usuario no tiene reservas
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'No se encontraron reservas para este usuario.' });
    }

    // Mapear el resultado a un formato más legible
    const reservas = result.rows.map(row => ({
      id: row[0],
      pelicula: row[1],
      horaFuncion: row[2],
      asientos: row[3],
      cantidadEntradas: row[4],
      fechaReserva: row[5],
    }));

    // Responder con las reservas del usuario
    return res.status(200).json({ reservas });
  } catch (error) {
    console.error('Error al obtener las reservas:', error);
    return res.status(500).json({ error: 'Error al obtener las reservas del usuario.' });
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

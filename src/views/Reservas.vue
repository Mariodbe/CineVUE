<template>
    <div class="reservas-container">
      <h2>Mis Reservas</h2>
  
      <!-- Si las reservas están vacías o no se han cargado aún -->
      <div v-if="loading" class="loading">
        <p>Cargando tus reservas...</p>
      </div>
  
      <div v-if="error" class="error">
        <p>{{ error }}</p>
      </div>
  
      <!-- Si hay reservas disponibles -->
      <div v-if="reservas.length > 0" class="reservas-list">
        <div v-for="reserva in reservas" :key="reserva.id" class="reserva-item">
          <h3>{{ reserva.pelicula }}</h3>
          <p>Hora de la función: {{ reserva.horaFuncion }}</p>
          <p>Asientos reservados: {{ reserva.asientos }}</p>
          <p>Cantidad de entradas: {{ reserva.cantidadEntradas }}</p>
        </div>
      </div>
  
      <!-- Si no hay reservas -->
      <div v-if="reservas.length === 0" class="no-reservas">
        <p>No tienes reservas aún.</p>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        reservas: [],  // Aquí se almacenarán las reservas del usuario
        loading: false, // Indica si se está cargando la información
        error: null,    // Mensaje de error en caso de que falle la solicitud
      };
    },
    methods: {
      async obtenerReservas() {
        this.loading = true; // Empezamos a cargar
        this.error = null;   // Reseteamos cualquier mensaje de error previo
  
        try {
          // Realizar la solicitud al backend sin pasar el usuarioId
          const response = await fetch('http://localhost:3000/reservas'); // Ya no pasa el usuarioId en la URL
  
          // Verificar si la respuesta fue exitosa
          if (!response.ok) {
            throw new Error(`Error: ${response.statusText}`);
          }
  
          const data = await response.json();
          this.reservas = data.reservas || [];  // Asignar las reservas si están disponibles
        } catch (error) {
          console.error('Error al obtener las reservas:', error);
          this.error = `Hubo un error al cargar tus reservas. Detalles: ${error.message}`;
        } finally {
          this.loading = false; // Terminamos la carga
        }
      },
    },
    created() {
      // Obtener las reservas al montar el componente
      this.obtenerReservas();
    },
  };
  </script>
  
  <style scoped>
  .reservas-container {
    padding: 20px;
  }
  
  h2 {
    text-align: center;
    margin-bottom: 20px;
  }
  
  .loading {
    text-align: center;
    font-size: 18px;
    color: #888;
  }
  
  .error {
    color: red;
    font-size: 16px;
    text-align: center;
  }
  
  .reservas-list {
    margin-top: 20px;
  }
  
  .reserva-item {
    background-color: #f9f9f9;
    padding: 15px;
    margin: 10px 0;
    border-radius: 5px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }
  
  .reserva-item h3 {
    margin: 0 0 10px 0;
    font-size: 20px;
  }
  
  .no-reservas {
    text-align: center;
    font-size: 18px;
    color: #555;
  }
  </style>
  
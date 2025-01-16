<template>
  <div class="movies">
    <h1 class="text-center">Películas</h1>

    <div v-for="movie in movies" :key="movie.id" class="movie-card" @click="selectMovie(movie)">
      <div class="movie-card-content">
        <div class="movie-image-wrapper">
          <img :src="movie.image" :alt="movie.title" class="movie-image" />
        </div>
        <div class="movie-info">
          <h3>{{ movie.title }}</h3>
          <p>Director: {{ movie.director }}</p>
          <p>Año: {{ movie.year }}</p>
        </div>
      </div>
    </div>

    <!-- Modal para mostrar los detalles de la película -->
    <div v-if="selectedMovie" class="modal-overlay" @click.self="closeModal">
      <div class="modal-content">
        <div class="modal-image-wrapper">
          <img :src="selectedMovie.image" :alt="selectedMovie.title" class="modal-image" />
        </div>
        <h2>{{ selectedMovie.title }}</h2>
        <p><strong>Director:</strong> {{ selectedMovie.director }}</p>
        <p><strong>Año:</strong> {{ selectedMovie.year }}</p>
        <p><strong>Sinopsis:</strong> {{ selectedMovie.synopsis }}</p>
        <p><strong>Cast:</strong> {{ selectedMovie.cast.join(', ') }}</p>
        <button class="btn btn-danger" @click="openTimeSelection">Comprar Entradas</button>
        <button class="btn btn-secondary" @click="closeModal" >Cerrar</button>
      </div>
    </div>

    <!-- Modal para seleccionar la hora de la película -->
    <SelectTime v-if="showTimeSelection" @next="openSeatSelection" @close="closeTimeSelection" />

    <!-- Modal para seleccionar las butacas -->
    <SelectSeats v-if="showSeatSelection" @back="goBackToTimeSelection" @next="handleNext" @close="closeSeatSelection" />

    <TicketPurchase v-if="showTicketPurchase" :selectedSeats="selectedSeats"  @back="goBackToSelectSeats"/>
  </div>
</template>

<script>
import movies from '../movies.json';
import SelectTime from './SelectTime.vue';
import SelectSeats from './SelectSeats.vue';
import TicketPurchase from "./TicketPurchase.vue";


export default {
  name: 'Movies',
  components: {
    SelectTime,
    SelectSeats,
    TicketPurchase 
  },
  data() {
    return {
      movies,
      selectedMovie: null,
      showTimeSelection: false,
      showSeatSelection: false,
      showTicketPurchase: false,
      selectedSeats: [],
    };
  },
  methods: {
    selectMovie(movie) {
      this.selectedMovie = movie;
    },
    closeModal() {
      this.selectedMovie = null;
    },
    openTimeSelection() {
      this.showTimeSelection = true;
      this.closeModal(); // Cierra el modal de la película actual al abrir la selección de hora
    },
    closeTimeSelection() {
      this.showTimeSelection = false;
    },
    openSeatSelection(selectedTime) {
      this.showTimeSelection = false;
      this.showSeatSelection = true;
      console.log(`Hora seleccionada: ${selectedTime}`);
    },
    goBackToTimeSelection() {
      this.showSeatSelection = false;
      this.showTimeSelection = true;
    },
    closeSeatSelection() {
      this.showSeatSelection = false;
    },
     goBackToSelectSeats() {
      this.showTicketPurchase = false;
      this.showSeatSelection = true;
    },
    handleNext(seats) {
      this.selectedSeats = seats;
      this.showSeatSelection = false;
      this.showTicketPurchase = true;
    },
  },
};
</script>


<style scoped>
/* Estilo general de la página */
.movies {
  background-color: #121212; /* Fondo oscuro */
  color: white; /* Texto blanco */
  padding: 20px;
  height: 100vh; /* Asegura que la página ocupe toda la altura */
  display: flex;
  flex-direction: column;
  justify-content: flex-start; /* Alinea el contenido en la parte superior */
}

/* Estilo para el título */
.text-center {
  text-align: center;
  margin-bottom: 20px;
}

/* Estilo para cada tarjeta de película */
.movie-card {
  border: 1px solid #333;
  padding: 15px;
  margin: 10px 0;
  border-radius: 5px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
  transition: all 0.3s ease;
  cursor: pointer;
  background-color: #1e1e1e; /* Fondo oscuro para la tarjeta */
  display: flex;
  flex-direction: row; /* Organiza la imagen y el texto en una fila */
  margin-bottom: 20px;
  flex-shrink: 0;
  height: 160px; /* Ajusta la altura para que no sobrepasen la pantalla */
}

.movie-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 15px rgba(0, 0, 0, 0.3);
}

/* Contenedor de contenido dentro de cada tarjeta */
.movie-card-content {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  height: 100%;
}

/* Contenedor para la imagen */
.movie-image-wrapper {
  flex: 0 0 120px; /* Tamaño fijo para el cuadro de imagen */
  height: 100%;
  margin-right: 15px; /* Espaciado entre la imagen y el texto */
  overflow: hidden; /* Oculta cualquier contenido fuera del cuadro */
  background-color: #333;
  border-radius: 5px;
  display: flex;
  justify-content: center;
  align-items: center;
}

/* Estilo de la imagen */
.movie-image {
  width: 100%;
  height: 100%;
  object-fit: cover; /* Ajusta la imagen sin distorsionarse */
  border-radius: 5px;
}

/* Contenedor de la información de la película */
.movie-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.movie-info h3 {
  font-size: 1.5rem;
  color: white;
  margin: 0 0 10px 0;
}

.movie-info p {
  margin: 5px 0;
  color: #ddd;
}

/* Modal estilo */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8); /* Fondo negro con algo de transparencia */
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background: rgba(50, 50, 50, 0.9); /* Fondo gris oscuro con algo de transparencia */
  padding: 30px;
  border-radius: 10px;
  max-width: 500px;
  width: 100%;
  text-align: left;
  color: white; /* Texto blanco en el modal */
}

.modal-image-wrapper {
  margin-bottom: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-image {
  width: 100%;
  max-width: 250px;
  height: auto;
  object-fit: cover;
  border-radius: 5px;
}

.modal-content h2 {
  font-size: 2rem;
  margin-bottom: 15px;
}

.modal-content p {
  margin-bottom: 10px;
}

.modal-content button {
  margin-top: 15px;
  width: 100%;
}

.modal-content .btn-secondary {
  background-color: #555;
  border: none;
  font-weight: bold;
}

/* Botón de "Comprar Entradas" */
.modal-content .btn-danger {
  background-color: #e74c3c;
  border: none;
  color: white;
  font-weight: bold;
  padding: 10px;
}

.modal-content .btn-danger:hover {
  background-color: #c0392b;
}
</style>
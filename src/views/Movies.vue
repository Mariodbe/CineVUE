<template>
  <div class="movies">
    <h1 class="text-center">Películas</h1>

    <div
      v-for="movie in movies"
      :key="movie.id"
      class="movie-card"
      @click="selectMovie(movie)"
    >
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
          <img
            :src="selectedMovie.image"
            :alt="selectedMovie.title"
            class="modal-image"
          />
        </div>
        <h2>{{ selectedMovie.title }}</h2>
        <p><strong>Director:</strong> {{ selectedMovie.director }}</p>
        <p><strong>Año:</strong> {{ selectedMovie.year }}</p>
        <p><strong>Sinopsis:</strong> {{ selectedMovie.synopsis }}</p>
        <p><strong>Cast:</strong> {{ selectedMovie.cast.join(", ") }}</p>
        <button class="btn btn-danger" @click="openTimeSelection">
          Comprar Entradas
        </button>
        <button class="btn btn-secondary" @click="closeModal">Cerrar</button>
      </div>
    </div>

    <!-- Modal para seleccionar la hora de la película -->
    <SelectTime
      v-if="showTimeSelection"
      :selectedMovie="selectedMovie"
      @next="openSeatSelection"
      @close="closeTimeSelection"
    />

    <!-- Modal para seleccionar las butacas -->
    <SelectSeats
      v-if="showSeatSelection"
      :selectedMovie="selectedMovie"
      @back="goBackToTimeSelection"
      @next="handleNext"
      @close="closeSeatSelection"
    />

    <!-- Modal para confirmar la compra de entradas -->
    <TicketPurchase
      v-if="showTicketPurchase"
      :selectedMovie="selectedMovie"
      :selectedSeats="selectedSeats"
      @back="goBackToSelectSeats"
    />
  </div>
</template>

<script>
import movies from "../movies.json";
import SelectTime from "./SelectTime.vue";
import SelectSeats from "./SelectSeats.vue";
import TicketPurchase from "./TicketPurchase.vue";

export default {
  name: "Movies",
  components: {
    SelectTime,
    SelectSeats,
    TicketPurchase,
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
      this.selectedMovie = movie; // Guarda la película seleccionada
    },
    closeModal() {
      this.selectedMovie = null; // Cierra el modal estableciendo selectedMovie en null
    },
    openTimeSelection() {
      if (!this.selectedMovie) {
        alert("Por favor, selecciona una película primero."); // Verifica si hay película seleccionada
        return;
      }
      this.showTimeSelection = true; // Muestra la selección de hora
      // Ya no llamamos a closeModal aquí
    },
    closeTimeSelection() {
      this.showTimeSelection = false; // Oculta la selección de hora
    },
    openSeatSelection() {
      if (!this.selectedMovie) {
        alert("Por favor, selecciona una película primero."); // Verifica si hay película seleccionada
        return;
      }
      this.showTimeSelection = false; // Oculta la selección de hora
      this.showSeatSelection = true; // Muestra la selección de asientos
    },
    goBackToTimeSelection() {
      this.showSeatSelection = false; // Oculta la selección de asientos
      this.showTimeSelection = true; // Vuelve a la selección de hora
    },
    closeSeatSelection() {
      this.showSeatSelection = false; // Oculta la selección de asientos
    },
    goBackToSelectSeats() {
      this.showTicketPurchase = false; // Oculta la compra de boletos
      this.showSeatSelection = true; // Regresa a la selección de asientos
    },
    handleNext(seats) {
      if (!this.selectedMovie) {
        alert("Por favor, selecciona una película primero."); // Verifica si hay película seleccionada
        return;
      }
      console.log("Asientos seleccionados:", seats); // Depuración para verificar los asientos
      this.selectedSeats = seats; // Guarda los asientos seleccionados
      this.showSeatSelection = false; // Oculta la selección de asientos
      this.showTicketPurchase = true; // Muestra la compra de boletos
    },
  },
};
</script>

<style scoped>
.movies {
  background-color: #121212;
  color: white;
  padding: 20px;
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
}

.text-center {
  text-align: center;
  margin-bottom: 20px;
}

.movie-card {
  border: 1px solid #333;
  padding: 15px;
  margin: 10px 0;
  border-radius: 5px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
  transition: all 0.3s ease;
  cursor: pointer;
  background-color: #1e1e1e;
  display: flex;
  flex-direction: row;
}

.movie-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 15px rgba(0, 0, 0, 0.3);
}

.movie-card-content {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  width: 100%;
}

.movie-image-wrapper {
  flex: 0 0 120px;
  height: 100%;
  margin-right: 15px;
  overflow: hidden;
  background-color: #333;
  border-radius: 5px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.movie-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 5px;
}

.movie-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.movie-info h3 {
  font-size: 1.5rem;
  color: white;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background: rgba(50, 50, 50, 0.9);
  padding: 30px;
  border-radius: 10px;
  max-width: 500px;
  width: 100%;
  text-align: left;
  color: white;
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

<template>
  <div class="movie-card">
    <div class="card">
      <!-- Imagen de la película -->
      <img :src="movie.posterUrl" class="card-img-top" :alt="movie.title" />

      <div class="card-body">
        <!-- Título de la película -->
        <h5 class="card-title">{{ movie.title }}</h5>
        <!-- Descripción de la película -->
        <p class="card-text">{{ movie.description }}</p>

        <div class="button-container">
          <!-- Botón para ver más detalles -->
          <router-link :to="`/movies/${movie.id}`" class="btn btn-primary">
            Ver más
          </router-link>

          <!-- Botón para agregar a favoritos -->
          <button @click="addToFavorites" class="btn btn-secondary">
            Agregar a favoritos
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "MovieCard",
  props: {
    movie: {
      type: Object,
      required: true,
    },
  },
  methods: {
    // Método para agregar la película a favoritos (puedes conectarlo con un sistema real de favoritos)
    addToFavorites() {
      console.log(`${this.movie.title} agregado a favoritos.`);
      // Aquí podrías añadir código para manejar la lógica de favoritos
    },
  },
};
</script>

<style scoped>
.movie-card {
  width: 18rem;
  margin: 20px;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

.card {
  border: none;
  border-radius: 8px;
}

.card-img-top {
  width: 100%;
  height: 250px;
  object-fit: cover;
}

.card-body {
  text-align: center;
}

.card-title {
  font-size: 1.25rem;
  font-weight: bold;
  margin-bottom: 10px;
}

.card-text {
  font-size: 1rem;
  color: #555;
  margin-bottom: 15px;
}

.button-container {
  display: flex;
  justify-content: center;
  gap: 10px;
}

.btn {
  font-weight: bold;
  padding: 8px 16px;
  border-radius: 50px;
  transition: all 0.3s ease;
}

.btn:hover {
  transform: translateY(-5px);
}

.btn-primary {
  background-color: #007bff;
  border: none;
}

.btn-secondary {
  background-color: #28a745;
  border: none;
}

.btn-primary:hover {
  background-color: #0056b3;
}

.btn-secondary:hover {
  background-color: #218838;
}
</style>

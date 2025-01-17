<template>
  <div class="home">
    <!-- Galería con carrusel -->
    <div class="movies-gallery text-center py-0">
      <div class="container-fluid p-0">
        <div id="movieCarousel" class="carousel slide" data-bs-ride="carousel" data-bs-interval="3000">
          <div class="carousel-inner">
            <!-- Película 1 -->
            <div class="carousel-item active">
              <div class="carousel-image-container">
                <img src="https://th.bing.com/th/id/R.a677c61bd153c553c310b654b50d8eb7?rik=KJJFU39%2bEH2RyA&riu=http%3a%2f%2fs1.bwallpapers.com%2fwallpapers%2f2014%2f08%2f06%2fjoseph-gordon-levitt-in-inception_084548374.jpg&ehk=uefR2lmuae%2ftebEtlzdbrI%2bn6QNrCV8skAPxc3y8IlI%3d&risl=&pid=ImgRaw&r=0" class="d-block w-100" alt="Película 1">
                <div class="overlay"></div>
              </div>
            </div>
            <!-- Película 2 -->
            <div class="carousel-item">
              <div class="carousel-image-container">
                <img src="https://th.bing.com/th/id/R.c599c279505c8b6bc7a1614ff603a74b?rik=JzbCoOfeS7h%2bag&riu=http%3a%2f%2fwww.impawards.com%2f2023%2fposters%2fcreed_iii_ver10_xlg.jpg&ehk=fPynglkmclPXyarkamSquN3YXGEN6OgelL%2bQtTIMhYE%3d&risl=&pid=ImgRaw&r=0" class="d-block w-100" alt="Película 2">
                <div class="overlay"></div>
              </div>
            </div>
            <!-- Película 3 -->
            <div class="carousel-item">
              <div class="carousel-image-container">
                <img src="https://s3.cine3.com/2020/06/Posters-de-Interstellar-interestelar-1.jpg" class="d-block w-100" alt="Película 3">
                <div class="overlay"></div>
              </div>
            </div>
          </div>
          <!-- Controles del carrusel -->
          <button class="carousel-control-prev" type="button" data-bs-target="#movieCarousel" data-bs-slide="prev">
            <span class="carousel-control-prev-icon" aria-hidden="true"></span>
            <span class="visually-hidden">Anterior</span>
          </button>
          <button class="carousel-control-next" type="button" data-bs-target="#movieCarousel" data-bs-slide="next">
            <span class="carousel-control-next-icon" aria-hidden="true"></span>
            <span class="visually-hidden">Siguiente</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Sección principal -->
    <div class="hero-section text-center text-white py-5">
      <div class="container">
        <div class="tab-buttons mb-4">
          <button class="btn movies-tab me-2" :class="{ active: activeTab === 'movies' }" @click="activeTab = 'movies'">DISPONIBLES</button>
          <button class="btn coming-soon-tab" :class="{ active: activeTab === 'coming-soon' }" @click="activeTab = 'coming-soon'">PRÓXIMAMENTE</button>
        </div>

        <hr class="separator" />

        <div v-if="activeTab === 'movies'" class="movies-grid">
          <div class="movie-card" v-for="movie in movies" :key="movie.id">
            <img :src="movie.image" class="movie-image" alt="movie.title" />
            <h5 class="movie-title">{{ movie.title }}</h5>
          </div>
        </div>

        <div v-if="activeTab === 'coming-soon'" class="movies-grid">
          <div class="movie-card" v-for="movie in comingSoon" :key="movie.id">
            <img :src="movie.image" class="movie-image" alt="movie.title" />
            <h5 class="movie-title">{{ movie.title }}</h5>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal de inicio de sesión -->
    <Login v-if="showLogin" @closeModal="closeModal" />
    <!-- Modal de registro -->
    <Register v-if="showRegister" @closeModal="closeModal" />
  </div>
</template>

<script>
export default {
  name: "Home",
  data() {
    return {
      showLogin: false,
      showRegister: false,
      activeTab: 'movies',
      movies: [
        {
          id: 1,
          title: "Película 1",
          image: "https://www.aceprensa.com/wp-content/uploads/2010/08/27205-0.jpg"
        },
        {
          id: 2,
          title: "Película 2",
          image: "https://www.lahiguera.net/cinemania/pelicula/10465/creed_iii-cartel-10767.jpg"
        },
        {
          id: 3,
          title: "Película 3",
          image: "https://m.media-amazon.com/images/I/91vmAIK3d5L._AC_SL1500_.jpg"
        }
      ],
      comingSoon: [
        {
          id: 4,
          title: "Próxima Película 1",
          image: "https://th.bing.com/th/id/OIP.32bKs1f8gFRRp5VlwOr3uQAAAA?rs=1&pid=ImgDetMain"
        },
        {
          id: 5,
          title: "Próxima Película 2",
          image: "https://th.bing.com/th/id/R.a2c74940f0e653669603f0283d19bad2?rik=Hl2OrlvBubBUfw&riu=http%3a%2f%2fsun9-71.userapi.com%2fimpg%2foK5r-NpG0jYQXQnGdZ0yxZCBaJUIyy6iFmoZ2w%2fpb9J9cV7TNk.jpg%3fsize%3d600x900%26quality%3d95%26sign%3d39472d17ce8aaaf726915f9bd2943b09%26type%3dalbum&ehk=F%2bRbLl6TJ%2fnFNpRU5EUABIvl5PYnw43pZyllL9a4Evc%3d&risl=&pid=ImgRaw&r=0"
        },
        {
          id: 5,
          title: "Próxima Película 3",
          image: "https://www.ecartelera.com/carteles-series/2100/2125/001.jpg"
        }
      ]
    };
  },
  methods: {
    openLogin() {
      this.showLogin = true;
      this.showRegister = false;
    },
    openRegister() {
      this.showLogin = false;
      this.showRegister = true;
    },
    closeModal() {
      this.showLogin = false;
      this.showRegister = false;
    }
  }
};
</script>

<style scoped>
.home {
  margin: 0;
  padding: 0;
}

.movies-gallery .container-fluid {
  padding: 0;
  margin: 0;
}

.movies-gallery .carousel-inner {
  height: 70vh; /* Aumentar la altura del carrusel a 70vh */
}

.carousel-item img {
  object-fit: cover;
  width: 100%;
  height: 100%;
   /* La imagen cubre toda el área disponible */
}

.carousel-image-container {
  position: relative;
  width: 100%;
  height: 100%;
  
}

.overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5); /* Hacer la capa gris un poco más clara */
  opacity: 1; /* Capa visible siempre */
  transition: opacity 0.3s ease;
}

.carousel-image-container:hover .overlay {
  opacity: 0; /* Capa desaparece cuando el ratón pasa por encima */
}

.tab-buttons .btn {
  padding: 15px 30px;
  font-size: 1.2rem;
  border-radius: 5px;
  background-color: transparent;
  color: black;
  transition: background-color 0.3s ease, color 0.3s ease;
}

.tab-buttons .btn:hover {
  background-color: red;
  color: white;
}

.tab-buttons .btn.active {
  background-color: red;
  color: white;
}

.tab-buttons {
  display: flex;
  justify-content: flex-start;
  margin-bottom: 20px;
}

.separator {
  border: none;
  border-top: 2px solid #ccc;
  margin: 20px 0;
}

.movies-grid {
  display: flex;
  justify-content: center;
  gap: 15px;
  flex-wrap: wrap;
  padding: 20px 0;
}

.movie-card {
  width: 300px;
  text-align: center;
  background: #fff;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.movie-card img {
  width: 100%;
  height: 400px;
  object-fit: cover;
}

.movie-title {
  font-size: 1.2rem;
  font-weight: bold;
  margin: 10px 0;
}
</style>

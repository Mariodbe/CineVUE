<template>
  <header>
    <!-- Barra de navegación -->
    <nav class="navbar navbar-expand-lg navbar-dark bg-dark fixed-top">
      <div class="container-fluid">
        <router-link class="navbar-brand mx-auto" to="/">Magicinema</router-link>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarNav">
          <ul class="navbar-nav ms-auto text-center mx-auto">
            <li class="nav-item">
              <router-link class="nav-link nav-item-link" to="/">HOME</router-link>
            </li>
            <li class="nav-item">
              <router-link class="nav-link nav-item-link" to="/movies">PELÍCULAS</router-link>
            </li>
            <li class="nav-item">
              <router-link class="nav-link nav-item-link" to="/contact">RESERVAS</router-link>
            </li>
            <div class="vr mx-2"></div>

            <!-- Mostrar nombre de usuario y botón de cerrar sesión si el usuario está autenticado -->
            <li v-if="user" class="nav-item d-flex align-items-center ms-auto">
              <span class="nav-link text-white">{{ user }}</span>
              <a href="#" @click.prevent="logout" class="nav-link logout-btn">CERRAR SESIÓN</a>
            </li>
            <!-- Botones de Iniciar sesión y Registrarse si no hay usuario -->
            <li v-if="!user" class="nav-item d-flex align-items-center ms-auto">
              <a href="#" @click.prevent="openLogin" class="nav-link login-btn">INICIAR SESIÓN</a>
              <span class="mx-3 text-white">/</span>
              <a href="#" @click.prevent="openRegister" class="nav-link register-btn">REGISTRARSE</a>
            </li>
          </ul>
        </div>
      </div>
    </nav>

    <!-- Modal Login -->
    <Login :isVisible="isLoginVisible" @closeModal="closeLoginModal" @login-success="handleLoginSuccess" />

    <!-- Modal Register -->
    <Register :isVisible="isRegisterVisible" @closeModal="closeRegisterModal" />
  </header>
</template>

<script>
import Login from './Login.vue';
import Register from './Register.vue';

export default {
  name: 'Header',
  components: {
    Login,
    Register
  },
  data() {
    return {
      isLoginVisible: false,
      isRegisterVisible: false,
      user: localStorage.getItem('user') || null, // Recuperar usuario desde localStorage
    };
  },
  methods: {
    openLogin() {
      this.isLoginVisible = true;
      this.isRegisterVisible = false;
    },
    openRegister() {
      this.isRegisterVisible = true;
      this.isLoginVisible = false;
    },
    closeLoginModal() {
      this.isLoginVisible = false;
    },
    closeRegisterModal() {
      this.isRegisterVisible = false;
    },
    handleLoginSuccess(username) {
      this.user = username;  // Guardar el nombre de usuario al iniciar sesión
      localStorage.setItem('user', username);  // Guardarlo en localStorage
      this.closeLoginModal();
    },
    logout() {
      this.user = null;
      localStorage.removeItem('user');  // Eliminar del localStorage
    }
  }
};
</script>

<style scoped>
/* El estilo de la barra de navegación */
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@600&display=swap');

.navbar-brand {
  font-family: 'Poppins', sans-serif;
  font-size: 2rem;
  font-weight: 600;
  letter-spacing: 1px;
  text-transform: uppercase;
}

.navbar-nav .nav-link {
  font-size: 1.2rem;
  margin-right: 20px;
  text-decoration: none;
  color: white;
  transition: color 0.3s ease;
}

.navbar-nav .nav-item-link:hover {
  color: gray;
}

.navbar-nav .login-btn,
.navbar-nav .register-btn {
  font-weight: 700;
  font-size: 1rem;
  transition: color 0.3s ease;
}

.navbar-nav .login-btn:hover,
.navbar-nav .register-btn:hover {
  color: red;
  transform: translateY(-2px);
}

.navbar-nav .logout-btn {
  font-weight: 700;
  font-size: 1rem;
  color: red;
  cursor: pointer;
}

.navbar-nav .logout-btn:hover {
  color: darkred;
  transform: translateY(-2px);
}

.vr {
  height: 30px;
  border-left: 1px solid #fff;
}

.navbar-collapse {
  display: flex;
  justify-content: center;
  align-items: center;
}

.navbar-nav {
  display: flex;
  justify-content: center;
  align-items: center;
}

.navbar-nav .d-flex {
  display: flex;
  align-items: center;
}

.navbar-nav .text-white {
  color: white;
}

.navbar-nav .mx-3 {
  margin-left: 10px;
  margin-right: 10px;
}

.navbar-nav .ms-auto {
  margin-left: auto;
}

.navbar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 9999;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

body {
  padding-top: 80px;
}
</style>

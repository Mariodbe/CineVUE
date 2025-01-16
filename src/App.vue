<template>
  <div id="app">
    <Header @showModal="setModal" /> <!-- El Header emite el evento showModal -->
    
    <!-- Mostrar el modal de Login si el valor de showModal es 'login' -->
    <Login v-if="showModal === 'login'" @showModal="setModal" />
    
    <!-- Mostrar el modal de Register si el valor de showModal es 'register' -->
    <Register v-if="showModal === 'register'" @showModal="setModal" />
    
    <router-view /> <!-- Se renderizan las vistas según la ruta -->
  </div>
</template>

<script>
// Importamos los componentes necesarios
import Header from './componentes/Header.vue';
import Login from './componentes/Login.vue';
import Register from './componentes/Register.vue';

export default {
  name: 'App',
  components: {
    Header,
    Login,
    Register
  },
  data() {
    return {
      showModal: ''  // El valor puede ser 'login', 'register' o vacío
    };
  },
  methods: {
    setModal(modalType) {
      if (modalType === '') {
        this.showModal = '';  // Cerrar cualquier modal
      } else {
        this.showModal = modalType;  // Abrir el modal de login o register
      }
    }
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>

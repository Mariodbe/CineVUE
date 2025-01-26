import { createApp } from 'vue'; // Asegúrate de importar `createApp`
import App from './App.vue';
import 'bootstrap'; // Importar Bootstrap JavaScript
import 'bootstrap/dist/css/bootstrap.min.css'; // Importar Bootstrap CSS
import { createRouter, createWebHistory } from 'vue-router'; // Usa las funciones correctas de Vue Router
import Home from './views/Home.vue'; // Asegúrate de que la ruta sea correcta
import Movies from './views/Movies.vue'; // Asegúrate de que la ruta sea correcta
import axios from 'axios'; // Importar axios

// Crea el enrutador usando el historial de navegador
const routes = [
  { path: '/', component: Home },
  { path: '/movies', component: Movies }
];

// Crear el enrutador con `createRouter`
const router = createRouter({
  history: createWebHistory(),
  routes
});

// Crea y monta la aplicación Vue
const app = createApp(App); // Crea la instancia de la aplicación Vue
app.config.globalProperties.$axios = axios; // Agregar axios globalmente a la aplicación
app.use(router); // Usa el enrutador en la aplicación
app.mount('#app'); // Monta la aplicación en el elemento con id 'app'

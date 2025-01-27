import { createRouter, createWebHistory } from 'vue-router';
import Home from '../views/Home.vue';
import Movies from '../views/Movies.vue';
import Login from '../views/Login.vue';
import Reservas from '../views/Reservas.vue';  // Importa el componente Reservas

// Define las rutas para la aplicación
const routes = [
  { path: '/', component: Home },  // Ruta para la página principal
  { path: '/movies', component: Movies },  // Ruta para la página de películas
  { path: '/login', component: Login },  // Ruta para la página de Login
  { path: '/reservas', component: Reservas },  // Ruta para la página de Reservas
];

// Crea el enrutador usando el historial de navegador (modo HTML5)
const router = createRouter({
  history: createWebHistory(),  // Usa `createWebHistory` para el historial de navegación
  routes,  // Rutas definidas previamente
});

export default router;  // Exporta el enrutador para que se pueda usar en el archivo principal

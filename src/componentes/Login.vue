<template>
  <div class="modal" tabindex="-1" id="loginModal" v-if="isVisible">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Iniciar sesión</h5>
          <button type="button" class="btn-close" @click="closeModal"></button>
        </div>
        <div class="modal-body">
          <form @submit.prevent="submitLogin">
            <div class="mb-3">
              <label for="email" class="form-label">Correo electrónico</label>
              <input type="email" class="form-control" id="email" v-model="email" required />
            </div>
            <div class="mb-3">
              <label for="password" class="form-label">Contraseña</label>
              <input type="password" class="form-control" id="password" v-model="password" required />
            </div>
            <button type="submit" class="btn btn-primary">Iniciar sesión</button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Login',
  props: {
    isVisible: Boolean
  },
  data() {
    return {
      email: '',
      password: ''
    };
  },
  methods: {
    submitLogin() {
      // Aquí puedes agregar la lógica para manejar el inicio de sesión
      console.log('Iniciando sesión con:', this.email, this.password);
      this.closeModal();
    },
    closeModal() {
      this.$emit('closeModal');
    }
  }
};
</script>

<style scoped>
.modal {
  display: block;
}
</style>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.7); /* Fondo más transparente */
  display: flex;
  align-items: center; /* Centra el modal verticalmente */
  justify-content: center; /* Centra el modal horizontalmente */
  z-index: 9999;
}

.modal-dialog {
  margin-top: 200px; /* Aumento del margen superior para más separación */
}

.modal-content {
  background: rgba(50, 50, 50, 0.9);
  color: white;
  padding: 30px; /* Aumento de padding para más espacio interno */
  border-radius: 8px;
  width: 350px; /* Un poco más ancho */
  text-align: center;
}

.form-group {
  margin-bottom: 15px;
}

input {
  width: 100%;
  padding: 10px;
  margin-top: 10px; /* Separación superior mayor */
  border: none;
  border-radius: 5px;
  background-color: #555;
  color: white;
}

button {
  padding: 10px 20px;
  background-color: red;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

button:hover {
  background-color: #cc0000;
}

.close-btn {
  margin-top: 10px;
  padding: 10px;
  background-color: #888;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.close-btn:hover {
  background-color: #555;
}
</style>

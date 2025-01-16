<template>
  <div class="modal-overlay" @click.self="closeModal">
    <div class="modal-content">
      <h3><span class="bold-text">Selecciona una hora</span></h3>
      <div class="time-options">
        <button
          class="btn btn-lg"
          :class="{'selected': selectedTime === '19:10'}"
          @click="selectTime('19:10')"
        >
          <span >19:</span>10
        </button>
        <button
          class="btn btn-lg"
          :class="{'selected': selectedTime === '21:45'}"
          @click="selectTime('21:45')"
        >
          <span >21:</span>45
        </button>
      </div>
      <button class="btn btn-secondary" @click="closeModal">
        <span class="bold-text">Cerrar</span>
      </button>
      <button class="btn btn-success" @click="nextStep" :disabled="!selectedTime">
        <span class="bold-text">Siguiente</span>
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: "SelectTime",
  data() {
    return {
      selectedTime: null,
    };
  },
  methods: {
    selectTime(time) {
      this.selectedTime = time;
    },
    closeModal() {
      this.$emit('close');
    },
    nextStep() {
      if (this.selectedTime) {
        this.$emit('next', this.selectedTime); // Emitir el evento 'next' con la hora seleccionada
        this.closeModal(); // Cierra el modal después de seleccionar la hora
      }
    },
  },
};
</script>

<style scoped>
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
  padding: 40px;
  border-radius: 10px;
  max-width: 500px;
  width: 100%;
  text-align: center;
  color: white;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.time-options {
  margin-bottom: 20px;
}

.time-options button {
  margin: 10px;
  font-size: 1.2rem;
  padding: 10px 20px;
  background-color: #3498db;
  border: none;
  color: white;
  border-radius: 5px;
}

.time-options button:hover {
  background-color: #2980b9;
}

/* Estilo para los botones seleccionados */
.time-options button.selected {
  background-color: #95a5a6; /* Gris suave */
}

.modal-content button {
  width: 100%;
}

.modal-content .btn-secondary {
  background-color: #555;
  border: none;
}

.modal-content .btn-success {
  background-color: #2ecc71;
  border: none;
  margin-top: 10px;
}

.modal-content .btn-success:disabled {
  background-color: #95a5a6;
}

/* Estilo para poner las letras en negrita */
.bold-text {
  font-weight: bold;
}
</style>

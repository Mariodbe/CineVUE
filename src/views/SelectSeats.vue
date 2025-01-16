<template>
  <div class="modal-overlay" @click.self="closeModal">
    <div class="modal-content">
      <!-- Texto de la parte superior -->
      <div class="select-seats-header">
        <h3>Selecciona tu asiento</h3>
      </div>

      <!-- Pantalla de cine -->
      <div class="screen-wrapper">
        <div class="screen">
          <p class="screen-text">Pantalla</p>
        </div>
      </div>

      <!-- Butacas numeradas -->
      <div class="seats-container">
        <div class="seats-row" v-for="(row, index) in rows" :key="index">
          <div
            v-for="(seat, seatIndex) in row"
            :key="seatIndex"
            class="seat"
            :class="{'selected': selectedSeats.includes(seat)}"
            @click="toggleSeat(seat)"
          >
            {{ seat }}
          </div>
        </div>
      </div>

      <!-- Botones -->
      <div class="button-container">
        <button class="btn btn-secondary" @click="goBack">Atrás</button>
        <button class="btn btn-success" @click="nextStep">Siguiente</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "SelectSeats",
  data() {
    return {
      rows: [
        ['A1', 'A2', 'A3', 'A4', 'A5', 'A6', 'A7', 'A8', 'A9', 'A10', 'A11', 'A12', 'A13', 'A14'],
        ['B1', 'B2', 'B3', 'B4', 'B5', 'B6', 'B7', 'B8', 'B9', 'B10', 'B11', 'B12', 'B13', 'B14'],
        ['C1', 'C2', 'C3', 'C4', 'C5', 'C6', 'C7', 'C8', 'C9', 'C10', 'C11', 'C12', 'C13', 'C14'],
        ['D1', 'D2', 'D3', 'D4', 'D5', 'D6', 'D7', 'D8', 'D9', 'D10', 'D11', 'D12', 'D13', 'D14'],
        ['E1', 'E2', 'E3', 'E4', 'E5', 'E6', 'E7', 'E8', 'E9', 'E10', 'E11', 'E12', 'E13', 'E14'],
      ],
      selectedSeats: [],
    };
  },
  methods: {
    toggleSeat(seat) {
      if (this.selectedSeats.includes(seat)) {
        this.selectedSeats = this.selectedSeats.filter((s) => s !== seat);
      } else {
        this.selectedSeats.push(seat);
      }
    },
    closeModal() {
      this.$emit('close');
    },
    goBack() {
      this.$emit('back');
    },
    nextStep() {
      if (this.selectedSeats.length === 0) {
        alert("Por favor, selecciona al menos un asiento.");
      } else {
        // Emitir evento para avanzar al componente TicketPurchase
        this.$emit("next", this.selectedSeats);
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
  padding: 30px;
  border-radius: 10px;
  width: 80%;
  max-width: 900px;
  text-align: center;
  color: white;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
}

.select-seats-header {
  margin-bottom: 20px;
}

.select-seats-header h3 {
  font-size: 1.5rem;
  font-weight: bold;
}

.screen-wrapper {
  width: 100%;
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
}

.screen {
  width: 90%;
  height: 50px;
  background-color: #1e1e1e;
  border-radius: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.screen-text {
  color: white;
  font-size: 1rem;
  font-weight: bold;
}

.seats-container {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.seats-row {
  display: flex;
  justify-content: center;
  margin-bottom: 10px;
}

.seat {
  width: 30px;
  height: 30px;
  background-color: #555;
  margin: 5px;
  border-radius: 5px;
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
  cursor: pointer;
  font-size: 0.9rem;
}

.seat:hover {
  background-color: #3498db;
}

.selected {
  background-color: #2ecc71;
}

.button-container {
  display: flex;
  justify-content: space-between;
  width: 100%;
  margin-top: 20px;
}

.modal-content button {
  padding: 10px 20px;
  width: 48%;
  font-weight: bold;
}

.modal-content .btn-secondary {
  background-color: #555;
  border: none;
}

.modal-content .btn-success {
  background-color: #2ecc71;
  border: none;
}
</style>

<template>
  <div class="modal-overlay" @click.self="closeModal">
    <div class="modal-content">
      <!-- Texto de la parte superior -->
      <div class="header">
        <h3>Selecciona tus entradas</h3>
        <p class="ticket-count">{{ totalSelectedTickets }}/{{ selectedSeats.length }}</p>
      </div>

      <!-- Lista de tipos de entradas -->
      <div class="ticket-types">
        <div v-for="type in ticketTypes" :key="type.id" class="ticket-type">
          <label :for="type.id">{{ type.label }} ({{ type.price.toFixed(2) }}€)</label>
          <input
            type="number"
            :id="type.id"
            v-model.number="selectedTickets[type.id]"
            :max="getMaxForType(type.id)"
            min="0"
          />
        </div>
      </div>

      <!-- Precio total -->
      <div class="total-price">
        <p>Total: {{ totalPrice.toFixed(2) }}€</p>
      </div>

      <!-- Botones -->
      <div class="button-container">
        <button class="btn btn-secondary" @click="goBack">Atrás</button>
        <button class="btn btn-success" @click="proceedToPayment" :disabled="!isSelectionComplete">Pagar</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "TicketPurchase",
  props: {
    selectedSeats: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      ticketTypes: [
        { id: "general", label: "General", price: 11.5 },
        { id: "child", label: "Menores de 13 años", price: 8.9 },
        { id: "youth", label: "Bono joven", price: 8.9 },
        { id: "senior", label: "Mayores de 65", price: 8.9 },
      ],
      selectedTickets: {
        general: 0,
        child: 0,
        youth: 0,
        senior: 0,
      },
    };
  },
  computed: {
    totalSelectedTickets() {
      return Object.values(this.selectedTickets).reduce((sum, count) => sum + count, 0);
    },
    remainingTickets() {
      return this.selectedSeats.length - this.totalSelectedTickets;
    },
    isSelectionComplete() {
      return this.remainingTickets === 0;
    },
    totalPrice() {
      return Object.entries(this.selectedTickets).reduce(
        (total, [key, count]) =>
          total + count * (this.ticketTypes.find((type) => type.id === key)?.price || 0),
        0
      );
    },
  },
  methods: {
    getMaxForType(typeId) {
      return this.remainingTickets + this.selectedTickets[typeId];
    },
    closeModal() {
      this.$emit("close");
    },
    goBack() {
      this.$emit("back");
    },
    proceedToPayment() {
      this.$emit("proceed", {
        selectedTickets: this.selectedTickets,
        totalPrice: this.totalPrice,
      });
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
  max-width: 600px;
  text-align: center;
  color: white;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
}

.header {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.header h3 {
  font-size: 1.5rem;
  font-weight: bold;
}

.ticket-count {
  font-size: 1rem;
  color: #ccc;
  font-weight: bold;
}

.ticket-types {
  width: 100%;
  margin-bottom: 20px;
}

.ticket-type {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
  font-weight: bold;
}

.ticket-type label {
  flex: 1;
  text-align: left;
  font-weight: bold;
}

.ticket-type input {
  width: 60px;
  text-align: center;
  font-weight: bold;
}

.total-price {
  font-size: 1.2rem;
  font-weight: bold;
  margin-bottom: 20px;
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

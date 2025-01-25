<template>
  <div class="modal-overlay" @click.self="closeModal">
    <div class="modal-content">
      <!-- Encabezado -->
      <div class="header">
        <h3>Pago</h3>
        <button class="close-btn" @click="closeModal">X</button>
      </div>

      <!-- Resumen del pedido -->
      <div class="payment-summary">
        <h4>Resumen de la compra</h4>
        <ul>
          <li v-for="(ticket, index) in filteredTickets" :key="index">
            {{ ticketLabels[ticket.type] }}: {{ ticket.count }} x
            {{ getTicketPrice(ticket.type).toFixed(2) }}€
          </li>
        </ul>
        <p class="total">Total: {{ totalPrice.toFixed(2) }}€</p>
      </div>

      <!-- Formulario de pago -->
      <div class="payment-form">
        <h4>Detalles de pago</h4>
        <form @submit.prevent="processPayment">
          <div class="form-group">
            <label for="cardNumber">Número de tarjeta</label>
            <input
              type="text"
              id="cardNumber"
              v-model="paymentDetails.cardNumber"
              placeholder="1111222233334444"
              required
            />
          </div>

          <div class="form-row">
            <div class="form-group">
              <label for="expiryDate">Fecha de caducidad</label>
              <input
                type="text"
                id="expiryDate"
                v-model="paymentDetails.expiryDate"
                placeholder="MM/AA"
                required
              />
            </div>
            <div class="form-group">
              <label for="cvv">CVV</label>
              <input
                type="text"
                id="cvv"
                v-model="paymentDetails.cvv"
                placeholder="123"
                required
              />
            </div>
          </div>
          <button type="submit" class="btn btn-success">Pagar</button>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "PaymentWindow",
  props: {
    selectedTickets: {
      type: Object,
      required: true,
    },
    ticketTypes: {
      type: Array,
      required: true,
    },
    totalPrice: {
      type: Number,
      required: true,
    },
    selectedSeats: {
      type: Array,
      required: true,
    },
    selectedMovie: {
      type: String,
      required: true,
    },
    selectedShowtime: {
      type: String,
      required: true,
    },
    userId: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      paymentDetails: {
        cardNumber: "",
        expiryDate: "",
        cvv: "",
      },
    };
  },
  computed: {
    ticketLabels() {
      return this.ticketTypes.reduce((acc, type) => {
        acc[type.id] = type.label;
        return acc;
      }, {});
    },
    filteredTickets() {
      return Object.keys(this.selectedTickets).map((ticketId) => ({
        type: ticketId,
        count: this.selectedTickets[ticketId],
      }));
    },
  },
  methods: {
    getTicketPrice(typeId) {
      const ticket = this.ticketTypes.find((t) => t.id === typeId);
      return ticket ? ticket.price : 0;
    },
    closeModal() {
      this.$emit("close");
    },
    async processPayment() {
  console.log("selectedSeats:", this.selectedSeats); // Depuración

  if (!Array.isArray(this.selectedSeats) || this.selectedSeats.length === 0) {
    alert("No se han seleccionado asientos.");
    return;
  }

  const apiUrl = "http://localhost:3000/process-payment";

  try {
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        cardNumber: this.paymentDetails.cardNumber,
        expiryDate: this.paymentDetails.expiryDate,
        cvv: this.paymentDetails.cvv,
        pelicula: this.selectedMovie,
        hora_funcion: this.selectedShowtime,
        asientos: this.selectedSeats.join(", "),
        cantidad_entradas: this.filteredTickets.reduce(
          (sum, ticket) => sum + ticket.count,
          0
        ),
        UsuarioID: this.userId,
      }),
    });

    const result = await response.json();

    if (response.ok) {
      alert(result.message); // Mostrar mensaje de éxito
      this.$emit("payment-success"); // Emitir evento de éxito
      this.closeModal(); // Cerrar el modal
    } else {
      alert(result.message || "Error en el pago."); // Mostrar mensaje de error
    }
  } catch (error) {
    console.error("Error al procesar el pago:", error);
    alert("Error interno del servidor. Intente nuevamente más tarde.");
  }
}
,
  },
};
</script>

<style scoped>
/* Estilos del modal */
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
  max-width: 500px;
  text-align: center;
  color: white;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}

.header h3 {
  font-size: 1.5rem;
  font-weight: bold;
}

.close-btn {
  background: none;
  border: none;
  color: white;
  font-size: 1.2rem;
  cursor: pointer;
}

.payment-summary ul {
  list-style-type: none;
  padding: 0;
  text-align: left;
}

.payment-summary li {
  margin: 10px 0;
}

.payment-summary .total {
  margin-top: 20px;
  font-size: 1.2rem;
  font-weight: bold;
}

.payment-form .form-group {
  margin-bottom: 15px;
}

.payment-form .form-row {
  display: flex;
  justify-content: space-between;
}

.payment-form input {
  width: 100%;
  padding: 10px;
  border: none;
  border-radius: 5px;
  background-color: #555;
  color: white;
}

.payment-form input::placeholder {
  color: #aaa;
}

.payment-form button {
  margin-top: 20px;
  padding: 10px 20px;
  background-color: #2ecc71;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.payment-form button:hover {
  background-color: #27ae60;
}
</style>

<template>
  <div class="modal-overlay" @click.self="closeModal">
    <div class="modal-content">
      <!-- Encabezado -->
      <div class="header">
        <h3>Pago</h3>
        <button class="close-btn" @click="closeModal">X</button>
      </div>

      <!-- Formulario de pago -->
      <div class="payment-form">
        <h4>Detalles de pago</h4>
        <form @submit.prevent="validateCard">
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
  data() {
    return {
      paymentDetails: {
        cardNumber: "",
        expiryDate: "",
        cvv: "",
      },
    };
  },
  methods: {
  async validateCard() {
  try {
    const response = await fetch('http://localhost:3000/validate-card', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        cardNumber: this.paymentDetails.cardNumber,  // Número de tarjeta
        expiryDate: this.paymentDetails.expiryDate,  // Fecha de caducidad
        cvv: this.paymentDetails.cvv,                // CVV
      }),
    });

    const result = await response.json();

    if (response.ok) {
      // Si la respuesta es exitosa, mostramos el mensaje y emitimos el evento
      alert('Tarjeta válida');
      this.$emit('payment-success', this.paymentDetails.cardNumber); // Emitimos el evento con el número de la tarjeta
      this.processPayment();
        } else {
      // Si la tarjeta no es válida, mostramos el error
      alert(result.error || 'Error al validar la tarjeta');
    }
  } catch (error) {
    console.error('Error:', error);
    alert('Error al conectar con el servidor');
  }
},


  // Método de pago (a ser implementado)
  async processPayment() {
   window.location.href = '/';
  }
}

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

<template>
    <div class="grid-layout" id="CompraCrypto">
        <section class="crypto">
     
      <form @submit.prevent="procesarCompra" class="crypto-form">
        <h2>Comprar Criptomonedas</h2>
          <label>Selecciona una criptomoneda:</label>
          <select v-model="seleccion">
            <option v-for="(nombre, clave) in criptos" :key="clave" :value="clave">{{ nombre }}</option>
          </select>
        
        
          <label>Cantidad:</label>
          <input type="number" v-model.number="cantidad" min="0.00001" step="0.00001" @input="calcularPrecio" />
        
        
          <label>Total a pagar (ARS):</label>
          <input type="text" :value="total" readonly />
        
        <button type="submit" >Comprar</button>
      </form>
      </section>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  import Swal from 'sweetalert2';
  import { apiClient } from '@/services/ApiService';
  
  export default {
    data() {
      return {
        usuarioId: localStorage.getItem("user_id"),
        seleccion: '',
        cantidad: 0,
        precio: 0,
        criptos: {
          btc: "Bitcoin",
          eth: "Ethereum",
          dai: "Dai"
        }
      };
    },
    computed: {
      total() {
        return (this.cantidad * this.precio).toFixed(2);
      },
      
    },
    methods: {
        validarCompra() {
        if (!this.seleccion || this.cantidad <= 0) {
            Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Selecciona una criptomoneda y una cantidad válida.'
        });
          return;
        }
      },
      async calcularPrecio() {
        if (!this.seleccion) return;
        try {
          const { data } = await axios.get(`https://criptoya.com/api/argenbtc/${this.seleccion}/ars/${this.cantidad}`);
          this.precio = data.ask || 0;
        } catch (error) {
          console.error("Error obteniendo precio", error);
          Swal.fire("Error", "No se pudo obtener el precio", "error");
        }
      },
      async procesarCompra() {
        try {
           this.validarCompra();

          const transaccion = {
            user_id: this.usuarioId,
            action: 'purchase',
            crypto_code: this.seleccion,
            crypto_amount: this.cantidad.toString(),
            money: this.total,
            datetime: this.fecha()
          };
    
          this.$store.commit('addCrypto', {
          code: this.seleccion,
          amount: this.cantidad,
        });

          await apiClient.post('/transactions', transaccion);
          Swal.fire("Éxito", `Compraste ${this.cantidad} ${this.criptos[this.seleccion]} por ${this.total} ARS`, "success");
          this.seleccion = '';
          this.cantidad = 0;
          this.precio = 0;
        } catch (error) {
          console.error("Error en la compra", error);
          Swal.fire("Error", "No se pudo completar la compra", "error");
        }
      },
      fecha() {
        let fechaHora = new Date();
            let day = fechaHora.getDate();
            let month = fechaHora.getMonth() + 1;
            let year = fechaHora.getFullYear();
            let hour = fechaHora.getHours();
            let minute = fechaHora.getMinutes();
            let second = fechaHora.getSeconds();
            let millisecond = fechaHora.getMilliseconds();
             
           return `${year}-${`00${month}`.slice(-2)}-${`00${day}`.slice(-2)}T${`00${hour}`.slice(-2)}:${`00${minute}`.slice(-2)}:${`00${second}`.slice(-2)}.${`000${millisecond}`.slice(-3)}Z`;
      },
    }
  };
  </script>

<style scoped>
  

.crypto h2{
font-size: 36px;
font-weight: 600;
margin: 0 0 12px;
text-align: center;
}
.crypto {
  margin: 100px;
  
  padding: 30px;
  display: flex;
  background-color: white;
  border: solid 1.5px rgb(252, 250, 250);
  border-radius: 16px;
}
.crypto-form{
width: 100%;
margin: 0;
display: grid;
gap:16px;
}
.crypto-form input,
.crypto-form select,
.crypto-form button{
width: 100%;
height: 50px;
}
.crypto-form input,
.crypto-form select
{
border: 2px solid #ebebeb;
font-family: inherit;
font-size: 20px;
padding: 0 25px;
border-radius: 24px;
transition: all 0.375s;

}
.crypto-form button{
cursor: pointer;
width: 100%;
padding: 16px;
border-radius: 25px;
background-color: #2b06b1;
color:white;
border: 0;
font-family: inherit;
font-size: 1rem;
font-weight: 600;
text-align: center;
letter-spacing: 2px;
}
.grid-layout{
  display: grid;
  grid-template-areas: 'comprar';
  
 

}

.crypto{
  grid-area: comprar;
  
}

</style>
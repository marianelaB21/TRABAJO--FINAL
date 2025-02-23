<template>
    <div class="grid-layout" id="VentaCrypto">
        <section class="crypto">
            <form @submit.prevent="procesarVenta" class="crypto-form">
                <h2>Vender Criptomonedas</h2>
                
                <label>Selecciona la Criptomoneda:</label>
                <select v-model="seleccion">
                    <option v-for="cripto in cryptosDisponibles" :key="cripto.codigo" :value="cripto.codigo">
                        {{ cripto.nombre }} ({{ cripto.cantidad }} disponibles)
                    </option>
                </select>
                
                <label>Cantidad:</label>
                <input v-model.number="cantidad" type="number" min="0.00001" step="0.00001" @input="actualizar" />
                
                <label>Total a cobrar (ARS):</label>
                <input type="number" readonly :value="total" />
                
                <button type="submit">Vender</button>
            </form>
        </section>
    </div>
</template>

<script>
import axios from 'axios';
import { apiClient } from '@/services/ApiService';
import Swal from 'sweetalert2';

export default {
    name: 'VentaCrypto',
    data() {
        return {
            seleccion: '',
            cantidad: 0,
            precios: {},
        };
    },
    computed: {
        cryptosDisponibles() {
            return this.$store.state.compras.map(cripto => ({
                codigo: cripto.code,
                nombre: cripto.code.toUpperCase(),
                cantidad: cripto.amount,
            }));
        },
        total() {
            const precio = this.precios[this.seleccion] || 0;
            return (this.cantidad * precio).toFixed(2);
        },
      
    },
    methods: {
        validarVenta() {
        if (!this.seleccion || this.cantidad <= 0) {
            Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Selecciona una criptomoneda y una cantidad válida.'
        });
          return;
        }
      },
       
        actualizar() {
            if (this.seleccion) {
                const url = `https://criptoya.com/api/argenbtc/${this.seleccion}/ars/${this.cantidad}`;
                axios.get(url)
                    .then(response => {
                        this.precios[this.seleccion] = response.data.bid;
                    })
                    .catch(() => {
                        Swal.fire('Error', 'No se pudo obtener el precio de cambio', 'error');
                    });
            }
        },
        async procesarVenta() {
            this.validarVenta();
            try {
                const transaccion = {
                    user_id: localStorage.getItem('user_id'),
                    action: 'sale',
                    crypto_code: this.seleccion,
                    crypto_amount: this.cantidad.toString(),
                    money: this.total,
                    datetime: this.fecha(),
                };
                
                this.$store.commit('sellCrypto', {
                    code: this.seleccion,
                    amount: this.cantidad,
                });
                
                await apiClient.post('/transactions', transaccion);
                Swal.fire("Éxito", `Vendiste ${this.cantidad} ${this.seleccion}  por ${this.total} ARS`, "success");
                this.seleccion = '';
                this.cantidad = 0;
                this.precios = {};
            } catch(error) {
                 console.error(error); 
                Swal.fire('Error', 'No se pudo completar la venta', 'error');
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
        }
      },
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
    grid-template-areas: 'venta';
    
   

}

.crypto{
    grid-area: venta;
   
}


</style>
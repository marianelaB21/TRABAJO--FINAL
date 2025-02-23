<template> 
    <section>
      <HeaderCrypto />
      <div class="crypto-table">
        <table>
          <thead>
            <tr>
              <th>Criptomoneda</th>
              <th>Cantidad</th>
              <th>Valor Total ($)</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="crypto in Object.values(cryptos)" :key="crypto.name">
              <td>{{ crypto.name }}</td>
              <td>{{ crypto.amount }}</td>
              <td>${{ crypto.totalValue.toFixed(2) }}</td>
            </tr>
          </tbody>
          <tfoot>
            <tr>
              <th colspan="2">Total</th>
              <td>${{ totalValue.toFixed(2) }}</td>
            </tr>
          </tfoot>
        </table>
      </div>
    </section>
  </template>
  
  <script>
  import { apiClient } from "@/services/ApiService";
  import axios from 'axios';
  import HeaderCrypto from '@/components/HeaderCrypto.vue';
  
  export default {
    name: "EstadoActualView",
      components: {
       HeaderCrypto,
       },
    data() {
      return {
        cryptos: {
          btc: { name: "Bitcoin", amount: 0, totalValue: 0 },
          eth: { name: "Ethereum", amount: 0, totalValue: 0 },
          dai: { name: "Dai", amount: 0, totalValue: 0 },
        },
      };
    },
    computed: {
      totalValue() {
        return (
        this.cryptos.btc.totalValue +
        this.cryptos.eth.totalValue +
        this.cryptos.dai.totalValue
      );
        
      },
    },
    mounted() {
      this.Transaccion();
    },
    methods: {
      async Transaccion() {
        try {
          const user = localStorage.getItem("user_id");
          const response = await apiClient.get(`/transactions?q={"user_id": "${user}"}`);
          this.procesarTransaccion(response.data);
        } catch (error) {
          console.error("Error al obtener operaciones", error);
        }
      },
  
      procesarTransaccion(transacciones) {
        transacciones.forEach(op => {
        let cantidad = parseFloat(op.crypto_amount);
        if (op.action === "purchase") {
          if (op.crypto_code === "btc") this.cryptos.btc.amount += cantidad;
          if (op.crypto_code === "eth") this.cryptos.eth.amount += cantidad;
          if (op.crypto_code === "dai") this.cryptos.dai.amount += cantidad;
        } else if (op.action === "sale") {
          if (op.crypto_code === "btc") this.cryptos.btc.amount -= cantidad;
          if (op.crypto_code === "eth") this.cryptos.eth.amount -= cantidad;
          if (op.crypto_code === "dai") this.cryptos.dai.amount -= cantidad;
        }
      });
        this.obtenerPrecios();
      },
  
      async obtenerPrecios() {
        try {
        let btcPrecio = await axios.get("https://criptoya.com/api/argenbtc/btc/ars/1");
        this.cryptos.btc.totalValue = btcPrecio.data.totalBid * this.cryptos.btc.amount;
        
        let ethPrecio = await axios.get("https://criptoya.com/api/argenbtc/eth/ars/1");
        this.cryptos.eth.totalValue = ethPrecio.data.totalBid * this.cryptos.eth.amount;
        
        let daiPrecio = await axios.get("https://criptoya.com/api/argenbtc/dai/ars/1");
        this.cryptos.dai.totalValue = daiPrecio.data.totalBid * this.cryptos.dai.amount;
        } catch (error) {
          console.error("Error obteniendo precios", error);
      }
  
     }
  },
};
  
  </script>
  
  <style scoped>
    *{
      margin: 0;
      padding: 0;
      box-sizing: border-box;
  }
  body{
      font-family: 'Inter', sans-serif;
      color: #343a40;
      line-height: 1;
      display: flex;
      justify-content: center;
  }
  
  table{
      width: 800px;
      margin-top: 100px;
      border-collapse:collapse;
      font-size:18px;
  }
  
  th,td {
      padding: 16px 24px;
      text-align:left;
  }
  
  thead th{
      background-color: #08697f;
      color:white;
      width:25%;
  }
  
  tbody tr:nth-child(odd){
      background-color: #f8f9fa;
  }
  tbody tr:nth-child(even){
      background-color: #e9ecef;
  }
    
  
 </style>
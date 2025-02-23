<template>
    <div>
      <HeaderCrypto />
    </div>
    <div>
      
      <div class="tableAmounts">
        <table class="table table-striped">
          <thead>
            <tr>
              <th scope="col">Criptomoneda</th>
              <th scope="col">Resultado ($)</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(resultado, crypto) in resultadoInversiones" :key="crypto">
              <th class="tg-kxt4">{{ crypto }}</th>
              <td :class="{ 'ganancia': resultado >= 0, 'perdida': resultado < 0 }">
                {{ resultado.toFixed(2) }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </template>
  
  <script>
  import HeaderCrypto from '@/components/HeaderCrypto.vue';
  import { apiClient } from '@/services/ApiService';
  
  export default {
    name: 'InversionesView',
    components: { HeaderCrypto },
    data() {
      return {
        user_id: localStorage.getItem('user_id'),
        transacciones: [],
        resultadoInversiones: {},
      };
    },
    methods: {
      async obtenerTransacciones() {
        try {
          const response = await apiClient.get(`/transactions?q={"user_id": "${this.user_id}"}`);
          this.transacciones = response.data;
          this.Inversiones();
        } catch (error) {
          console.error('Error al obtener transacciones:', error);
        }
      },
  
      async obtenerPreciosCrypto(crypto) {
        try {
          const response = await fetch(`https://criptoya.com/api/argenbtc/${crypto}/ars`);
          return await response.json();
        } catch (error) {
          console.error(`Error obtener ${crypto} precio:`, error);
          return null;
        }
      },
  
      async Inversiones() {
        let balances = {};
        for (let transaccion of this.transacciones) {
          const { crypto_code, crypto_amount, money, action } = transaccion;
          
          if (!balances[crypto_code]) {
            balances[crypto_code] = { cantidad: 0, totalGastado: 0 };
          }
          
          if (action === 'purchase') {
            balances[crypto_code].cantidad += parseFloat(crypto_amount);
            balances[crypto_code].totalGastado += parseFloat(money);
          } else if (action === 'sale') {
            balances[crypto_code].cantidad -= parseFloat(crypto_amount);
            balances[crypto_code].totalGastado -= parseFloat(money);
          }
        }
        
        for (let crypto in balances) {
          const precioData = await this.obtenerPreciosCrypto(crypto);
          if (precioData) {
            const valorActual = balances[crypto].cantidad * precioData.totalBid;
            this.resultadoInversiones[crypto] = valorActual - balances[crypto].totalGastado;
          }
        }
      }
    },
    mounted() {
      this.obtenerTransacciones();
    }
  };
  </script>
  
  <style scoped>
  * {
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
  
  .title {
    text-align: center;
    margin-top: 20px;
  }
  
  table {
    width: 800px;
      margin-top: 100px;
      border-collapse:collapse;
      font-size:18px;
  }
  
  th, td {
    padding: 16px 24px;
    text-align:left;
  }
  
  thead th {
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
  
  .ganancia {
    color: green;
    font-weight: bold;
  }
  
  .perdida {
    color: red;
    font-weight: bold;
  }
  </style>
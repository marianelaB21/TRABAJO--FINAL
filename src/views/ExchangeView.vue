<template>

    <div>
      <HeaderCrypto></HeaderCrypto>
    </div>

    <div class="container">
      
      <div class="select-container">
        <label for="crypto">Criptomoneda</label>
        <select v-model="selectedCrypto" @change="obtenerPrecios">
          <option value="btc">Bitcoin</option>
          <option value="eth">Ethereum</option>
          <option value="dai">DAI</option>
        </select>
      </div>
      <div v-if="loading">Cargando precios...</div>
      <div v-if="error" class="error">{{ error }}</div>
      <table v-if="precios && Object.keys(precios).length">
        <thead>
          <tr>
            <th>Exchange</th>
            <th>Precio Compra</th>
            <th>Precio Venta</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(data, exchange) in precios" :key="exchange">
            <td>{{ exchange }}</td>
            <td>{{ data.bid.toFixed(2) }} ARS</td>
            <td>{{ data.ask.toFixed(2) }} ARS</td>
          </tr>
        </tbody>
      </table>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  import HeaderCrypto from '@/components/HeaderCrypto.vue';
  export default {
    name: "ExchangeView",
    components: {
       HeaderCrypto,
       },
    data() {
      return {
        selectedCrypto: 'btc',
        precios: {},
        loading: false,
        error: null,
      };
    },
    mounted() {
      this.obtenerPrecios();
    },
    methods: {
      async obtenerPrecios() {
        this.loading = true;
        this.error = null;
        try {
          const response = await axios.get(`https://criptoya.com/api/${this.selectedCrypto}/ars`);
          this.precios = response.data;
        } catch (err) {
          this.error = 'Error al obtener datos de la API';
        } finally {
          this.loading = false;
        }
      }
    }
  };
  </script>
  
  <style scoped>
  .container {
    text-align: center;
    margin: 100px;
    
  }
  .select-container{
    font-size: 1em;
    position: relative;
    min-height: 1em;
    margin: 1em 0;
    background: #f8f8f9;
    padding: 1em 1.5em;
    line-height: 1.4285em;
    color: rgba(0,0,0,.87);
    border-radius: 0.28571429rem;
    box-shadow: inset 0 0 0 1px rgba(34,36,38,.22), 0 0 0 0 transparent;
}
  /*.select-container {
    margin: 20px 0;
  }*/

  select{
    cursor: pointer;
    word-wrap: break-word;
    line-height: 1em;
    white-space: normal;
    outline: 0;
    -webkit-transform: rotate(0);
    transform: rotate(0);
    min-width: 14em;
    min-height: 2.71428571em;
    background: #fff;
    display: inline-block;
    padding: 0.78571429em 2.1em 0.78571429em 1em;
    color: rgba(0,0,0,.87);
    box-shadow: none;
    border: 1px solid rgba(34,36,38,.15);
    border-radius: 0.28571429rem;
    -webkit-transition: width .1s ease,-webkit-box-shadow .1s ease;
    -webkit-transition: box-shadow .1s ease,width .1s ease;
    transition: box-shadow .1s ease,width .1s ease;
  }
  table {
    width: 80%;
    margin: auto;
    border-collapse: collapse;
    background-color: white;
  }
  th, td {
    border: 1px solid hsl(0, 0%, 3%);
    padding: 10px;
  }
  .error {
    color: red;
  }
  </style>
<template>
    <div>
      <HeaderCrypto></HeaderCrypto>
    </div>
    <div class="historial">
      <table v-if="listarCripto.length > 0">
        <thead>
            <tr>
                <th>Action</th>
                <th>Code</th>
                <th>Amount</th>
                <th>Money</th>
                <th>Date</th>
            </tr>
        </thead>

        <tbody >
          
            <tr v-for="Cripto in listarCripto" :key="Cripto.id">
            <td >{{ Cripto.action }}</td>
            <td>{{  Cripto.crypto_code }}</td>
            <td>{{  Cripto.crypto_amount }}</td>
            <td>{{  Cripto.money }}</td>
            <td>{{  Cripto.datetime.toLocaleString() }}</td>
            <td><button class="btn btn-info" @click="obtener(Cripto._id, 1)">Detalles</button></td>
            <td><button class="btn btn-warning" @click="obtener(Cripto._id)">Editar</button></td>
            <td><button class="btn btn-danger" @click="eliminar(Cripto._id)">Eliminar</button></td>
            </tr>
        </tbody>
      </table>    
    </div>

    <div>
    <div class="modal" v-if="modalOne">
      <div class="modal-content">
        <span class="close" @click="modalOne = false">&times;</span>
        <h2 class="modal-title">Detalles</h2>
      
      <div class="modal-body">
        <form>
          <div class="form-group">
          <label for="tipo">Action:</label>
          <select id="tipo" v-model="detalles.action"  disabled> 
            <option value="" disabled selected>Seleccione una opción</option>
            <option value="purchase">Compra</option>
            <option value="sale">Venta</option>
          </select>
          </div>
          <div class="form-group">
          <label for="criptomonedas">Criptomonedas:</label>
          <select id="criptomonedas" v-model="detalles.crypto_code" disabled>
            <option value="" disabled selected>Seleccione una opción</option>
            <option value="btc">Bitcoin</option>
           <option value="dai">Dai</option>
           <option value="eth">Ethereum</option> 
          </select>
          </div>
          <div class="form-group">
          <label for="cantidad">Cantidad:</label>
          <input type="number" id="cantidad" min="0.00001" step="0.00001" v-model="detalles.crypto_amount" disabled />
          </div>
          <div class="form-group">
          <label for="precio">Precio:</label>
          <input type="number" id="precio" v-model="detalles.money" disabled />
          </div>
          <div class="form-group">
          <label for="fecha">Fecha:</label>
          <input type="text" id="fecha" :value="detalles.datetime" disabled />
          </div>
        </form>
      </div>
      </div>
    </div>
  </div>

  
  <div v-if="modalDos" class="modal">
    <div class="modal-content">
    
        <span class="close" @click="modalDos = false">&times;</span>
        <h2 class="modal-title">Editar</h2>
      
      <div class="modal-body">
        <form>
          <div class="form-group">
          <label for="tipo">Action:</label>
          <select id="tipo" v-model="tipoAction"  required> 
            <option value="" disabled selected>Seleccione una opción</option>
            <option value="purchase">Compra</option>
            <option value="sale">Venta</option>
          </select>
          </div>
          <div class="form-group">
          <label for="criptomonedas">Criptomonedas:</label>
          <select v-model="seleccion" requerid>
            <option v-for="(nombre, clave) in criptos" :key="clave" :value="clave">{{ nombre }}</option>
          </select>
          </div>
          <div class="form-group">
             <label for="cantidad">Cantidad:</label>
             <input v-model="cantidad" type="number" step="0.1" min="0.000001"   />
          </div>
          <div class="form-group">
            <label for="precio">Precio:</label>
            <input type="number" readonly :value="total" disabled />
          </div>
          <div class="form-group">
             <label for="fecha">Fecha:</label>
             <input type="text" id="fecha" :value="detalles.datetime" disabled />
          </div>
        </form>
      </div>
      <div class="modal-footer">
        <button class="button" @click="editar(detalles._id)" >Guardar</button>
        
      </div>
    </div>
  </div>
</template>

<script>
  import HeaderCrypto from '@/components/HeaderCrypto.vue';
  import axios from 'axios';
  import {apiClient} from '@/services/ApiService';
  import Swal from 'sweetalert2';
  export default {
      name: "MovimientosView",
      components: {
       HeaderCrypto,
       },
       data(){
      return{
        listarCripto: [],
        detalles:{
             _id: "",
            action: "",
            crypto_amount: "",
           crypto_code: "",
           datetime: "",
            money: "",
        },
        tipoAction: 'purchase',
        seleccion: '',
        cantidad: 0,
        precios: {},
        user_id: localStorage.getItem("user_id"),
        criptos: {
          btc: "Bitcoin",
          eth: "Ethereum",
          dai: "Dai"
        },
        
       modalOne: false,
       modalDos: false,
        
      };
    },
    computed: {
      
      total() {
        const precio = this.precios[this.seleccion] || 0;
        return (this.cantidad * precio).toFixed(2);
      },
      
    },
    methods: {
       
      getAlert(messagge) {
            Swal.fire({
                position: 'top-end',
                icon: 'success',
                title: messagge,
                showConfirmButton: false,
                timer: 2000
            })
        },

        obtener (id,accion) {
        if(accion == 1){
            this.modalOne = true;
        }
        else{
            this.modalDos=true;
        }

    apiClient
     .get(`/transactions/${id}`)
     .then((response) => {
        this.detalles = response.data;
         this.detalles.action = response.data.action;
         this.detalles.crypto_code = response.data.crypto_code;
         this.detalles.crypto_amount = response.data.crypto_amount;
         this.detalles.money = response.data.money;
         this.detalles.datatime = response.data.datatime;
         
     })
     .catch((error) => {
        console.error("Error al obtener los detalles:", error);
      })
     
    },
    editar(id){

    if (!this.seleccion || this.cantidad <= 0) {
        Swal.fire('Error', 'Por favor, selecciona una criptomoneda y una cantidad valida.', 'error');
        return;
    }

    const url = `https://criptoya.com/api/argenbtc/${this.seleccion}/ars/${this.cantidad}`;
    const action = this.tipoAction === 'purchase' ? 'ask' : 'bid';

    axios.get(url)
        .then((response) => {
            const precio = response.data[action];
            this.precios[this.seleccion] = precio;

            const Transaccion = {
                user_id: localStorage.getItem("user_id"),
                action: this.tipoAction,
                crypto_code: this.seleccion,
                crypto_amount: this.cantidad.toString(),
                money: (this.cantidad * precio).toFixed(2),
                datetime: this.fecha(),
            };

        
            return apiClient.patch(`/transactions/${id}`, Transaccion);
        })
        .then((response) => {
            console.log(response);
            this.getAlert("Editado Correctamente");
            this.modalDos = false;
            this.obtener();
            setTimeout(() => {
             window.location.reload(); 
             }, 1000);

        })
        .catch((error) => {
            console.error("Error al editar:", error);
            Swal.fire('Error', 'No se pudo editar la transacción.', 'error');
        })
        .finally(() => {
           
            this.seleccion = '';
            this.cantidad = 0;
            this.precios = {};
        });
      
    
    },
    fecha(){
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

         eliminar(id) {
            Swal.fire({
            title: "¿Estás seguro de eliminar?",
             text: "Si continúas, no puedes revertir la acción.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
             cancelButtonColor: "#d33",
            confirmButtonText: "Sí, eliminar!"
        }).then((result) => {
             if (result.isConfirmed) {
             apiClient
             .delete(`/transactions/${id}`)
             .then((response) => {
              console.log(response);
              this.getAlert("Eliminado correctamente");
             setTimeout(() => {
             window.location.reload(); 
             }, 1000); 
        })
        .catch((error) => {
          console.error("Ha ocurrido un error:", error);
        });
        }
        });
        }
       
  
      
    },
    
    created() {

    apiClient.get(`/transactions?q={"user_id": "${this.user_id}"}`)
      .then(response => {
        if (response.data && response.data.length > 0) {
            this.listarCripto = response.data;
          } else {
            this.listarCripto = [];  
          }
      })
      .catch(error => {
        console.error('Error al obtener datos de la API:', error);
      });
  },
}
</script>

<style scoped>
.popup {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background-color: rgba(0, 0, 0, 0.5);
}

.popup-content {
  position: relative;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: #fff;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
}
.historial {
    margin: 80px;
    padding: 30px;
}

table {
    width: 800px;
    font-family: sans-serif;
    font-weight: 100;
    border-collapse: collapse;
    overflow: hidden;
    box-shadow: 0 0 20px #0000001a;

}
th,
td {
    background-color: #ffffff33;
    padding: 15px;
    color: #fff;
}
th {
    text-align: left;
}
thead th {
  background-color: #55608f;
    
}
tbody tr:hover {
  background-color: #ffffff4d;
   
}
tbody td {
    position: relative;
}
tbody td:hover::before {
content: "";
position: absolute;
background-color: #ffffff33;
left: 0;
right: 0;
top: -9999px;
bottom: -9999px;
z-index: -1;
} 

.modal {
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  z-index: 1000;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
}

.modal-content {
  background-color: white;
  padding: 20px;
  border-radius: 5px;
  width: 500px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.close {
  color: #aaa;
  float: right;
  font-size: 28px;
  font-weight: bold;
}

.close:hover,
.close:focus {
  color: black;
  text-decoration: none;
  cursor: pointer;
}

h2 {
  margin: 0 0 20px;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  margin: 10px 0;
}

.modal-title {
  font-size: 1.5em;
  margin: 0;
}

.modal-body {
  margin: 20px 0;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
}

.button {
    background-color: #007bff;
    color: white;
  border: none;
  border-radius: 5px;
  padding: 10px 15px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.button:hover {
  background-color: #0056b3;
}

input[type="number"],
select {
  width: 100%;
  padding: 10px;
  margin: 10px 0;
  border: 1px solid #ccc;
  border-radius: 4px;
}

input[disabled] {
    background-color: #f9f9f9; 
    color: #999;
    cursor: not-allowed;
}

.btn {
  display: inline-block;
  font-weight: 400;
  text-align: center;
  white-space: nowrap;
  vertical-align: middle;
  user-select: none;
  padding: 0.375rem 0.75rem;
  font-size: 1rem;
  line-height: 1.5;
  border-radius: 0.25rem;
  border: 1px solid transparent;
  cursor: pointer;
  text-decoration: none;
  color: #fff;
}

.btn-danger {
  background-color: #dc3545;
  border-color: #dc3545;
}

.btn-danger:hover {
  background-color: #c82333;
  border-color: #bd2130;
}

.btn-warning {
  background-color: #ffc107;
  border-color: #ffc107;
  color: #212529;
}

.btn-warning:hover {
  background-color: #e0a800;
  border-color: #d39e00;
}

.btn-info {
  background-color: #17a2b8;
  border-color: #17a2b8;
}

.btn-info:hover {
  background-color: #138496;
  border-color: #117a8b;
}

.form-group {
  display: flex;
  align-items: center;
  gap: 10px;
}

label {
  font-size: 1em;
  color: #333;
}

input[type="number"] {
    flex: 1;
}

</style>
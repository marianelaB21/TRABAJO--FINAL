<template >
    <div class="login">
      <h2>Login</h2>
      <form @submit.prevent="addUser" class="login-form"> 
        <label name="idUsuario">ID</label>
        <input v-model.trim="user_id" id="idUsuario" type="text" placeholder="Ingrese su ID" required> 
        <button @click="addUser" type="submit">Ingresar</button>
      </form>
      
    </div> 
  </template>
  
  <script>
  
  export default {
    name: "LoginView",
    components: {
      
    },
    data(){
      return{
        user_id: ""
      }
    },
    methods: {
      addUser(){
        localStorage.setItem('user_id', this.user_id);
        
        this.$router.push('Home');
        
      }
    }
  }
  
  </script>
  <style >
  *{
    box-sizing: border-box;
  }
  
  body{
    height: 100%;
    background-color: #1B4865;
    display:grid;
    place-items: center;
    margin: 0;
    padding: 0 24px;
    background-repeat: no-repeat;
    background-size: cover;
    font-family: "ubuntu";
    color:rgb(0, 0, 0);
    animation:rotate 6s infinite alternate;
  }
  .login{
    position: relative;
    z-index: 3;
    width: 100px;
    margin: 0 20px;
    padding: 70px 30px  44px;
    border-radius: 1,25rem;
    border-radius: 1.25rem;
    background: white;
    text-align: center;
  }
  .login h2{
    font-size: 36px;
    font-weight: 600;
    margin: 0 0 12px;
  }
  
  .login-form{
    width: 100%;
    margin: 0;
    display: grid;
    gap:16px;
  }
  .login-form input,
  .login-form button{
    width: 100%;
    height: 50px;
  }
  .login-form input{
    border: 2px solid #ebebeb;
    font-family: inherit;
    font-size: 20px;
    padding: 0 25px;
    border-radius: 24px;
    transition: all 0.375s;
  
  }
  .login-form input:hover {
    border: 2px solid #03cb89;
  }
  .login-form button{
    cursor: pointer;
    width: 100%;
    padding: 16px;
    border-radius: 25px;
    background-color: #03cb89;
    color:white;
    border: 0;
    font-family: inherit;
    font-size: 1rem;
    font-weight: 600;
    text-align: center;
    letter-spacing: 2px;
    transition: all 0.3s;
  }
  .login-form button:hover{
    background: #019e6a;
  }
  @keyframes rotate {
    100% {
      background-position: 15% 50%;
    }
  }
  @media (width >=500px){
    body {
      .login{
        margin: 0;
        width: 400px;
      }
    }
  }
  
  </style>
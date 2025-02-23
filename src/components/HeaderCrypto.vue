<template>
    <header >
      <div class="container">
          <nav>
              <ul>
              <li><router-link to="/Home">Home</router-link> </li>
              <li><router-link to="/Movimientos">Movimientos</router-link> </li>
              </ul>
          </nav>
      </div>
    </header>
   
    
  </template>

<style >
*{
  box-sizing: border-box;
  margin:0;
  padding:0;
  font-size: 20px;
  text-decoration: none;
}


 header{
   width: 100%;
    align-items: center;
    
    height: 80px;
    position:fixed;
    top: 0;
    left: 0;
    right: 0;
    display: flex;
    background-color:  rgba(250, 250, 250, 0.937);
    padding: 5px 10%;
    justify-content: space-around;
    z-index: 1000;
} 

nav ul li {
  position: relative;
  float: left;
}

nav ul li{
  font-size:18px;
  padding: 20px;
  color: #FFFFFF;
  display:block;
}


</style>
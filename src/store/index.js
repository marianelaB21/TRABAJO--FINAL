import { createStore } from 'vuex'

export default createStore({
  state: {
    compras: [],
  },
  getters: {
  },
  mutations: {
    addCrypto(state, payload) {
      const existe = state.compras.find((c) => c.code === payload.code);
      if (existe) {
        existe.amount += payload.amount;
      } else {
        state.compras.push({ code: payload.code, amount: payload.amount });
      }
    },

    sellCrypto(state, payload) {
      const crypto = state.compras.find((c) => c.code === payload.code);
      if (crypto) {
        const cantidadVenta = parseFloat(payload.amount); 
        if (isNaN(cantidadVenta) || cantidadVenta <= 0) return; 
    
        crypto.amount -= cantidadVenta;
    
        state.compras = state.compras.filter((c) => c.amount > 0);
      }
    }
  },
  actions: {
  },
  modules: {
  }
})

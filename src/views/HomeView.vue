<template>
  <div>
      <HeaderCrypto></HeaderCrypto>
    </div> 
    <div class="container" >

        <CompraCrypto ></CompraCrypto>
        <VentaCrypto ></VentaCrypto>
    </div>
</template>

<script>

import CompraCrypto from '@/components/CompraCrypto.vue'
import HeaderCrypto from '@/components/HeaderCrypto.vue'
import VentaCrypto from '@/components/VentaCrypto.vue'

export default {
  name:"HomeView",
  components: {
      HeaderCrypto,
      CompraCrypto,
      VentaCrypto,
    },

};
</script>

<style>
.container {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 10px;
}
</style>
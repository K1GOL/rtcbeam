<template>
  <div class="container">
    <h2>Recieve files</h2>
    <p>Enter peer ID from sender:</p>
    <input type="text" v-model="senderPeerId" name="peerId">
    <span @click="transferFile">Download file</span>
  </div>
</template>

<script>

import { store } from '../store.js'

export default {
  name: 'RecieveFile',
  data () {
    return {
      store,
      senderPeerId: null
    }
  },
  methods: {
    transferFile () {
      try {
        if (this.senderPeerId) {
          this.$parent.requestFile(this.senderPeerId)
        }
      } catch (err) {
        store.appStatus = 'An error has occured.'
      }
    }
  }
}
</script>

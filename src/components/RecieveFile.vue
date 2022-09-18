<template>
  <div class="border-4 block border-black rounded-xl my-6 mx-auto p-6 w-fit text-lg shadow-[5px_5px]">
    <h1 class="font-semibold text-4xl m-3">Recieve files</h1>
    <p class="m-3">Enter peer ID from sender:</p>
    <input type="text" v-model="senderPeerId" name="peerId" class="m-6 inline-block p-2 border-4 border-black rounded-lg hover:ring ring-blue-600 ring-0 transition-all hover:ring-offset-4 ring-offset-transparent duration-200">
    <span tabindex="0" @click="transferFile" class="m-3 inline-block p-2 border-4 border-black rounded-lg hover:ring ring-blue-600 ring-0 transition-all hover:ring-offset-4 ring-offset-transparent duration-200 cursor-pointer">Download file</span>
    <br>
    <input type="checkbox" v-model="encrypt" class="m-3 inline-block p-2 border-2 border-black rounded-lg hover:ring ring-blue-600 ring-0 transition-all hover:ring-offset-2 ring-offset-transparent duration-200 cursor-pointer"/><p>End-to-end encrypted file transfer</p>
  </div>
</template>

<script>

import { store } from '../store.js'

export default {
  name: 'RecieveFile',
  data () {
    return {
      store,
      senderPeerId: null,
      encrypt: true
    }
  },
  methods: {
    transferFile () {
      try {
        if (this.senderPeerId) {
          this.$parent.requestFile(this.senderPeerId, this.encrypt)
        }
      } catch (err) {
        store.appStatus = 'An error has occured.'
      }
    }
  }
}
</script>

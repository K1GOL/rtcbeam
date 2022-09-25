<template>
  <div class="mx-auto text-2xl">
    <span tabindex="0" @click="showModal" class="m-6 inline-block p-2 border-4 border-black rounded-lg hover:ring ring-blue-600 ring-0 transition-all hover:ring-offset-4 ring-offset-transparent duration-200 cursor-pointer">
      <p class="cursor-pointer w-full h-full">⚙️ Configure server</p>
    </span>
  </div>
  <div ref="modal" class="fixed z-10 left-0 top-0 w-screen h-screen bg-black/[0.75] flex place-items-center hidden">
    <div class="border-4 block border-black rounded-xl m-auto p-6 w-fit h-fit text-lg shadow-[5px_5px] bg-green-500">
      <p class="text-2xl">Enter URL for the PeerServer to be used:</p>
      <input type="text" v-model="serverUrl" name="peerId" class="m-6 inline-block p-2 border-4 border-black rounded-lg hover:ring ring-blue-600 ring-0 transition-all hover:ring-offset-4 ring-offset-transparent duration-200">
      <span tabindex="0" @click="configureServer" class="m-3 inline-block p-2 border-4 border-black rounded-lg hover:ring ring-blue-600 ring-0 transition-all hover:ring-offset-4 ring-offset-transparent duration-200 cursor-pointer">Connect</span>
    </div>
  </div>
</template>

<script>

import { store } from '../store.js'

export default {
  name: 'ServerConfigure',
  data () {
    return {
      store,
      serverUrl: '0.peerjs.com'
    }
  },
  methods: {
    showModal () {
      // Shows configuration modal.
      this.$refs.modal.style.display = 'flex'
    },
    configureServer () {
      // Connect to a PeerServer with a URL provided by the user.
      this.$parent.createPeer(this.serverUrl)
      // Hide modal.
      this.$refs.modal.style.display = 'none'
    }
  }
}

</script>

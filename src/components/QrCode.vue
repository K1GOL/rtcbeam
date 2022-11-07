<template>
  <div class="mx-auto text-lg">
    <span tabindex="0" @click="showModal" class="m-3 inline-block p-2 border-4 border-black rounded-lg hover:ring ring-blue-600 ring-0 transition-all hover:ring-offset-4 ring-offset-transparent duration-200 cursor-pointer">
      <p class="cursor-pointer w-full h-full">📱 Show QR code</p>
    </span>
  </div>
  <div ref="modal" class="fixed z-10 left-0 top-0 w-screen h-screen bg-black/[0.75] flex place-items-center hidden">
    <div class="border-4 block border-black rounded-xl m-auto p-6 w-fit h-fit text-lg shadow-[5px_5px] bg-green-500">
      <p class="text-2xl">QR code</p>
      <canvas id="canvas"></canvas>
      <span tabindex="0" @click="closeModal" class="m-3 inline-block p-2 border-4 border-black rounded-lg hover:ring ring-blue-600 ring-0 transition-all hover:ring-offset-4 ring-offset-transparent duration-200 cursor-pointer">Close</span>
    </div>
  </div>
</template>

<script>

import { store } from '../store.js'
import QRCode from 'qrcode'

export default {
  name: 'QrCode',
  data () {
    return {
      store
    }
  },
  methods: {
    showModal () {
      // Shows modal.
      this.$refs.modal.style.display = 'flex'
      // Draw QR code
      const url = `https://rtc-beam.web.app?peer=${encodeURIComponent(store.peer.id)}&host=${encodeURIComponent(store.peer.options.host)}&encryption=1`
      QRCode.toCanvas(document.getElementById('canvas'), url, function (error) {
        if (error) console.error(error)
        console.log('success!')
      })
    },
    closeModal () {
      // Hide modal.
      this.$refs.modal.style.display = 'none'
    }
  }
}

</script>

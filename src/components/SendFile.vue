<template>
  <div class="border-4 block border-black rounded-xl my-6 mx-auto p-6 w-fit h-fit text-lg shadow-[5px_5px]">
    <h1 class="font-semibold text-4xl m-3">Send files</h1>
    <span tabindex="0" @click="buttonClick" class="m-6 inline-block p-2 border-4 border-black rounded-lg hover:ring ring-blue-600 ring-0 transition-all hover:ring-offset-4 ring-offset-transparent duration-200 cursor-pointer">
      <p class="cursor-pointer w-full h-full">Choose file</p>
    </span>
    <input type="file" id="file" ref="input" @change="readFile" hidden>
    <p>Your peer ID is:<br><b><i>{{ peerId }}</i></b></p>
    <span v-if="fileSelected" tabindex="0" @click="copyLink" class="m-6 inline-block p-2 border-4 border-black rounded-lg hover:ring ring-blue-600 ring-0 transition-all hover:ring-offset-4 ring-offset-transparent duration-200 cursor-pointer">
      <p class="cursor-pointer w-full h-full">🔗 Copy link</p>
    </span>
    <p v-if="linkCopied" class="absolute text-center w-32 left-0 right-0 mx-auto my-0">Link copied!</p>
  </div>
</template>

<script>

import { store } from '../store.js'

export default {
  name: 'SendFile',
  data () {
    return {
      store,
      peerId: '❌ No file selected.',
      fileSelected: false,
      linkCopied: false
    }
  },
  methods: {
    readFile () {
      // File to serve has been selected.
      const input = this.$refs.input

      // Get selected file.
      store.outboundFile = input.files[0]
      store.appStatus = `✉️ File ${store.outboundFile.name} is ready to tranfer.`
      this.peerId = store.peer.id
      this.fileSelected = true
    },
    buttonClick () {
      this.$refs.input.click()
    },
    copyLink () {
      // Copy shareable link to clipboard.
      navigator.clipboard.writeText(`https://rtc-beam.web.app?peer=${encodeURIComponent(store.peer.id)}&host=${encodeURIComponent(store.peer.options.host)}&encryption=1`)
      this.linkCopied = true
      // Disable "Link copied" -notification after a few seconds.
      const _this = this
      setTimeout(() => { _this.linkCopied = false }, 3000)
    }
  }
}
</script>

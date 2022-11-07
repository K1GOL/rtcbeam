<template>
  <div class="border-4 block border-black rounded-xl my-6 mx-auto p-6 w-fit text-lg shadow-[5px_5px]">
    <p>File {{ store.filename }} is ready to be saved.</p>
    <a tabindex="0" :href="getUrl()" v-bind:download="store.filename" @click="onFileDownload">
      <span class="m-3 inline-block p-2 border-4 border-black rounded-lg hover:ring ring-blue-600 ring-0 transition-all hover:ring-offset-4 ring-offset-transparent duration-200 cursor-pointer">Save file</span>
    </a>
  </div>
</template>

<script>

import { store } from '../store.js'

export default {
  name: 'SaveFile',
  data () {
    return {
      store
    }
  },
  methods: {
    onFileDownload () {
      store.fileReady = false
    },
    getUrl () {
      return URL.createObjectURL(store.inboundFile)
    }
  }
}
</script>

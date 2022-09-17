<template>
  <div class="container">
    <h2>File {{ store.filename }} is ready to be saved.</h2>
    <a :href="getUrl()" download @click="onFileDownload"><span>Save file</span></a>
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

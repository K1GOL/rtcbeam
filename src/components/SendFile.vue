<template>
  <div class="container">
    <h1>Send files</h1>
    <input type="file" ref="input" @change="readFile">
    <p>Your peer ID is: <b><i>{{ peerId }}</i></b></p>
  </div>
</template>

<script>

import { store } from '../store.js'

export default {
  name: 'SendFile',
  data () {
    return {
      store,
      peerId: 'No file selected.'
    }
  },
  methods: {
    readFile () {
      // File to serve has been selected.
      const input = this.$refs.input

      // Get selected file.
      store.outboundFile = input.files[0]
      store.appStatus = 'File ready to transfer.'
      this.peerId = store.peer.id
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>

<template>
  <div class="container">
    <p>{{ store.appStatus }}</p>
  </div>
</template>

<script>

import { store } from '../store.js'

export default {
  name: 'StatusLabel',
  data () {
    return {
      store
    }
  }
}
</script>

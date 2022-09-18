<template>
  <div class="my-6 mx-auto text-2xl">
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

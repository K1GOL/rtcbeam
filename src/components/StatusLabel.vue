<template>
  <div class="my-6 mx-auto text-2xl">
    <p>{{ store.appStatus }}</p>
    <p class="text-sm">Web client {{ store.version }} | Core {{ core.getVersion() }} | 2022 K1GOL | <u><a href="https://github.com/K1GOL/rtcbeam">https://github.com/K1GOL/rtcbeam</a></u></p>
  </div>
</template>

<script>

import { store } from '../store.js'
import * as core from '../rtcbeam-core/index.js'

export default {
  name: 'StatusLabel',
  data () {
    return {
      store,
      core
    }
  }
}
</script>

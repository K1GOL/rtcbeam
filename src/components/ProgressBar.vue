<template>
  <div class="border-4 block border-black rounded-xl my-6 mx-auto p-6 sm:w-3/6 xl:w-2/6 w-full text-lg transition-all duration-200 shadow-[5px_5px]">
    <p>Transferring file...</p>
    <p>{{ convert(store.currentBytes) }} / {{ convert(store.totalBytes) }}</p>
    <div class="w-full rounded-full h-2.5 bg-white my-3 outline outline-4 outline-black">
      <div class="bg-[#2c3e50] h-2.5 rounded-full" :style="{width: store.percentage + '%'}"></div>
    </div>
  </div>
</template>

<script>

import { store } from '../store.js'
import byteSize from 'byte-size'

export default {
  name: 'ProgressBar',
  data () {
    return {
      store
    }
  },
  methods: {
    convert (input) {
      return byteSize(input).toString()
    }
  }
}
</script>

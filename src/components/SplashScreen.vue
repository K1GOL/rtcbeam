<template>
  <div id="splash" ref="splash" class="flex justify-center w-full h-full fixed top-0 right-0 z-20 m-0">
    <div class="inline-block m-auto">
      <h1 class="text-6xl sm:text-9xl m-auto">rtcbeam</h1>
      <div id="bar" class="bg-[#2c3e50] rounded-lg h-2 m-auto"></div>
      <StatusLabel/>
    </div>
  </div>
</template>

<script>

import { store } from '../store.js'
import StatusLabel from './StatusLabel.vue'

export default {
  name: 'SplashScreen',
  data () {
    return {
      store
    }
  },
  mounted () {
    // Disable splash screen after animation has played.
    setTimeout(() => { this.$refs.splash.style.display = 'none' }, 1950)
  },
  components: { StatusLabel }
}
</script>

<style scoped>
  #splash {
    background: linear-gradient(332deg, rgba(137,232,191,1) 0%, rgba(62,203,90,1) 100%);
    background-repeat: no-repeat;
    background-attachment: fixed;
    animation-name: splashFade;
    animation-duration: 2.2s;
  }

  #bar {
    animation-name: splashBar;
    animation-duration: 2.2s;
  }

  @keyframes splashBar {
    0% { width: 0%; }
    50% { width: 100%; }
    100% { width: 100%; }
  }

  @keyframes splashFade {
    0% { opacity: 1; }
    50% { opacity: 1; }
    100% { opacity: 0; }
  }

</style>

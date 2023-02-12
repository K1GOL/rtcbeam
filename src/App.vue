<template>
  <div class="flex-col items-center w-full">
    <h1 class="text-6xl">rtcbeam</h1>
    <p class="text-lg">Peer-to-peer file transfer powered by WebRTC.</p>
    <SplashScreen/>
    <SendFile/>
    <ProgressBar v-if="showProgress"/>
    <SaveFile v-if="store.fileReady"/>
    <ReceiveFile/>
    <StatusLabel/>
    <ServerConfigure/>
  </div>
</template>

<script>
import { store } from './store.js'
import { Rtcbeam } from 'rtcbeam-core'
import SendFile from './components/SendFile.vue'
import ReceiveFile from './components/ReceiveFile.vue'
import StatusLabel from './components/StatusLabel.vue'
import SaveFile from './components/SaveFile.vue'
import ServerConfigure from './components/ServerConfigure.vue'
import SplashScreen from './components/SplashScreen.vue'
import ProgressBar from './components/ProgressBar.vue'

export default {
  name: 'App',
  components: {
    SendFile,
    ReceiveFile,
    StatusLabel,
    SaveFile,
    ServerConfigure,
    SplashScreen,
    ProgressBar
  },
  data () {
    return {
      store,
      showProgress: false
    }
  },
  methods: {
    requestFile (id, cid, encrypt) {
      store.core.requestData(id, cid, encrypt)
    },
    createPeer (host) {
      return store.core.createPeer(host)
    },
    updateProgress (progress) {
      // If new byte value is larger than current total, update total.
      if (progress > store.totalBytes) store.totalBytes = progress
      // Set current bytes transferred.
      // Use Math.max() to prevent value from dropping by progress updates arriving out of order.
      store.currentBytes = Math.max(store.currentBytes, store.totalBytes - progress)
      // Calculate percentage transferred.
      store.percentage = store.currentBytes / store.totalBytes * 100
      // Show progress bar when there is progress to show.
      if (progress > 0) {
        this.showProgress = true
      } else {
        this.showProgress = false
      }
    }
  },
  created () {
    // Create Rtcbeam.
    store.core = new Rtcbeam()
    // Link core app status.
    store.core.on('status', (s) => { store.appStatus = s })
    // Handle transfer completed.
    store.core.on('transfer-completed', (blob, metadata) => {
      store.inboundFile = blob
      store.filename = metadata.name
      store.fileReady = true
      this.showProgress = false
    })
    // Handle invalid cid provided.
    store.core.on('not-found', () => { store.appStatus = '❌ An invalid peer id was provided.' })
    // Handle progress updates.
    store.core.on('send-progress', (p) => this.updateProgress(p))
    store.core.on('receive-progress', (p) => this.updateProgress(p))
  },
  mounted () {
    // Check if URL parameters for peer, cid, host and encryption are present,
    // if yes, start transfering file.
    const urlPeer = decodeURIComponent(new URLSearchParams(window.location.search).get('peer'))
    const urlCid = decodeURIComponent(new URLSearchParams(window.location.search).get('cid'))
    const urlHost = decodeURIComponent(new URLSearchParams(window.location.search).get('host'))
    const urlEncryption = new URLSearchParams(window.location.search).get('encryption')
    // Pass a reference to this.
    const _this = this
    if (urlPeer && urlEncryption && urlHost) {
      // Check if host is not equal to current one.
      if (urlHost !== store.core.peer.options.host) {
        // Connect to host.
        this.createPeer(urlHost)
      }
      // Wait for peerjs to be ready.
      store.core.on('ready', () => {
        _this.requestFile(urlPeer, urlCid, (urlEncryption === '1'))
      })
    }
  }
}
</script>

<style>
@import './tailwind.css';
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;800&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Baloo+Thambi+2:wght@800&display=swap');

html {
  height: 100vh;
  overflow: hidden;
}

body {
  background: linear-gradient(332deg, rgba(137,232,191,1) 0%, rgba(62,203,90,1) 100%);
  height: 100%;
  margin: 0;
  overflow-y: scroll;
  background-repeat: no-repeat;
  background-attachment: fixed;
}

h1 {
  font-family: 'Baloo Thambi 2', cursive;
}

#app {
  font-family: Poppins, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

input[type=checkbox]
{
  /* Double-sized Checkboxes */
  -ms-transform: scale(2); /* IE */
  -moz-transform: scale(2); /* FF */
  -webkit-transform: scale(2); /* Safari and Chrome */
  -o-transform: scale(2); /* Opera */
  transform: scale(2);
  padding: 10px;
}

:focus {
  outline: none;
  box-shadow: 5px 5px;
}

input[type=checkbox]:focus {
  outline: none;
  box-shadow: 2px 2px;
}
</style>

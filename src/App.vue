<template>
  <div class="flex-col items-center w-full">
    <h1 class="text-6xl">rtcbeam</h1>
    <p class="text-lg">Peer-to-peer file transfer powered by WebRTC.</p>
    <SplashScreen/>
    <SendFile/>
    <SaveFile v-if="store.fileReady"/>
    <RecieveFile/>
    <StatusLabel/>
    <ServerConfigure/>
  </div>
</template>

<script>
import SendFile from './components/SendFile.vue'
import RecieveFile from './components/RecieveFile.vue'
import StatusLabel from './components/StatusLabel.vue'
import SaveFile from './components/SaveFile.vue'
import { store } from './store.js'
import ServerConfigure from './components/ServerConfigure.vue'
import SplashScreen from './components/SplashScreen.vue'
import * as core from './rtcbeam-core/index.js'

export default {
  name: 'App',
  components: {
    SendFile,
    RecieveFile,
    StatusLabel,
    SaveFile,
    ServerConfigure,
    SplashScreen
  },
  data () {
    return {
      store
    }
  },
  methods: {
    deliverFile (conn) {
      core.deliverFile(conn, store)
    },
    requestFile (id, encrypt) {
      core.requestFile(id, encrypt, store)
    },
    createPeer (host) {
      core.createPeer(host, store)
    }
  },
  created () {
    // Establish peerjs connection.
    this.createPeer()

    // On incoming connection
    store.peer.on('connection', (conn) => {
      this.deliverFile(conn)
    })
  },
  mounted () {
    // Check if URL parameters for peer, host and encryption are present,
    // if yes, start transfering file.
    const urlPeer = decodeURIComponent(new URLSearchParams(window.location.search).get('peer'))
    const urlHost = decodeURIComponent(new URLSearchParams(window.location.search).get('host'))
    const urlEncryption = new URLSearchParams(window.location.search).get('encryption')
    // Pass a reference to this.
    const _this = this
    if (urlPeer && urlEncryption && urlHost) {
      // Check if host is not equal to current one.
      if (urlHost !== store.peer.options.host) {
        // Connect to host.
        this.createPeer(urlHost)
      }
      // Wait for peerjs to be ready.
      store.peer.on('open', function (id) {
        _this.requestFile(urlPeer, (urlEncryption === '1'))
      })
    }
  }
}
</script>

<style>
@import './tailwind.css';
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;800&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Baloo+Thambi+2:wght@800&display=swap');

body {
  background: linear-gradient(332deg, rgba(137,232,191,1) 0%, rgba(62,203,90,1) 100%);
  height: 100wh;
  margin: 0;
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

<template>
  <div class="flex-col items-center w-full">
    <h1 class="text-6xl">rtcbeam</h1>
    <p class="text-lg">Peer-to-peer file transfer powered by WebRTC.</p>
    <SendFile/>
    <SaveFile v-if="store.fileReady"/>
    <RecieveFile/>
    <StatusLabel/>
  </div>
</template>

<script>
import SendFile from './components/SendFile.vue'
import RecieveFile from './components/RecieveFile.vue'
import StatusLabel from './components/StatusLabel.vue'
import SaveFile from './components/SaveFile.vue'
import * as pjs from './peerjs.min.js'
import * as nacl from './nacl.min.js'
import * as naclUtil from './nacl-util.min.js'
import { v4 as uuidv4 } from 'uuid'
import { store } from './store.js'

export default {
  name: 'App',
  components: {
    SendFile,
    RecieveFile,
    StatusLabel,
    SaveFile
  },
  data () {
    return {
      store
    }
  },
  methods: {
    deliverFile (conn) {
      // Recieve connection.
      store.appStatus = 'Connecting to peer...'
      conn.on('open', () => {
        // Connection established to peer.
        // Serve file.
        conn.on('data', (d) => {
          const data = JSON.parse(d)
          if (data.action === 'request-file' && (data.encryptionKey && data.nonce)) {
            // Valid request for file has been recieved.
            // Deliver file.
            store.appStatus = 'Delivering file to peer...'
            const file = store.outboundFile
            const mime = file.type

            // Start by reading file.
            const reader = new FileReader()
            reader.readAsArrayBuffer(file)
            reader.onload = function () {
              const b = new Blob([reader.result], { type: mime })

              // File has been read, encrypt.
              b.arrayBuffer().then(buf => {
                // Generate authentication key pair.
                const keyPair = nacl.box.keyPair()
                let message
                // Check if encryption should be skipped.
                if (data.flags.includes('no-encryption')) {
                  message = new Uint8Array(buf)
                } else {
                  store.appStatus = 'Encrypting file...'
                  message = nacl.box(
                    new Uint8Array(buf),
                    naclUtil.decodeBase64(data.nonce),
                    naclUtil.decodeBase64(data.encryptionKey),
                    keyPair.secretKey
                  )
                }

                // Notify transfer starting.
                conn.send(JSON.stringify({
                  action: 'notify-transfer-start',
                  flags: []
                }))

                // Copy flags from request.
                const flags = data.flags
                // Send file over network.
                store.appStatus = 'Sending file...'
                conn.send(JSON.stringify({
                  action: 'deliver-file',
                  flags: flags,
                  message: naclUtil.encodeBase64(message),
                  authenticationKey: naclUtil.encodeBase64(keyPair.publicKey),
                  metadata: {
                    filename: file.name,
                    type: mime
                  }
                }))
              })
            }
            reader.onerror = function () {
              console.log(reader.error)
            }
          } else if (data.action === 'confirm-transfer-finish') {
            // Notify transfer completed.
            store.appStatus = 'File transfer completed.'
          }
        })
      })
    },
    requestFile (id, encrypt) {
      // Request file.
      store.appStatus = 'Connecting to peer...'
      const conn = store.peer.connect(id)
      conn.on('open', () => {
        // Connection established.
        store.appStatus = 'Requesting file...'
        // Generate encryption keys.
        const keyPair = nacl.box.keyPair()
        const nonce = nacl.randomBytes(nacl.box.nonceLength)
        // Send file request.
        const flags = []
        if (!encrypt) flags.push('no-encryption')
        conn.send(JSON.stringify({
          action: 'request-file',
          flags: flags,
          encryptionKey: naclUtil.encodeBase64(keyPair.publicKey),
          nonce: naclUtil.encodeBase64(nonce)
        }))
        // Store nonce and secrey key for decrypting reply.
        store.nonce = nonce
        store.secretKey = keyPair.secretKey

        // Data is being recieved.
        conn.on('data', (d) => {
          const data = JSON.parse(d)
          if (data.action === 'deliver-file' && data.authenticationKey && data.message) {
            // File recieved, check if decryption is needed.
            let uintArray
            if (data.flags.includes('no-encryption')) {
              uintArray = naclUtil.decodeBase64(data.message)
            } else {
              store.appStatus = 'Decrypting file...'
              uintArray = nacl.box.open(
                naclUtil.decodeBase64(data.message),
                store.nonce,
                naclUtil.decodeBase64(data.authenticationKey),
                store.secretKey
              )
            }

            // Show save file button.
            const blob = new Blob([uintArray], { type: data.metadata.type })
            store.inboundFile = blob
            store.filename = data.metadata.filename
            store.fileReady = true
            store.appStatus = 'File transfer completed.'
            // Notify sender that transfer is done.
            conn.send(JSON.stringify({
              action: 'confirm-transfer-finish',
              flags: []
            }))
          } else if (data.action === 'notify-transfer-start') {
            // Transfer has started.
            store.appStatus = 'Recieving file...'
          }
        })
      })
    }
  },
  created () {
    // Establish peerjs connection.
    store.appStatus = 'Establishing connection...'
    const peer = new pjs.peerjs.Peer('rtb-' + uuidv4())
    store.peer = peer

    peer.on('open', function (id) {
      store.appStatus = 'Connected to network.'
    })

    // On incoming connection
    store.peer.on('connection', (conn) => {
      this.deliverFile(conn)
    })
  },
  mounted () {
    // Check if both URL parameters for peer and encryption are present,
    // if yes, start transfering file.
    const urlPeer = new URLSearchParams(window.location.search).get('peer')
    const urlEncryption = new URLSearchParams(window.location.search).get('encryption')
    // Pass a reference to this.
    const _this = this
    if (urlPeer && urlEncryption) {
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
  height: 100%;
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

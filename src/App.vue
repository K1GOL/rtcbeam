<template>
  <SendFile/>
  <RecieveFile/>
  <StatusLabel/>
  <SaveFile v-if="store.fileReady"/>
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
              // Generate authentication key pair.
              store.appStatus = 'Encrypting file...'
              const keyPair = nacl.box.keyPair()

              // File has been read, encrypt.
              b.arrayBuffer().then(buf => {
                nacl.box.overheadLength = 0
                const encryptedMessage = nacl.box(
                  new Uint8Array(buf),
                  naclUtil.decodeBase64(data.nonce),
                  naclUtil.decodeBase64(data.encryptionKey),
                  keyPair.secretKey
                )
                // Notify transfer starting.
                conn.send(JSON.stringify({
                  action: 'notify-transfer-start',
                  flags: []
                }))

                // Send file over network.
                store.appStatus = 'Sending file...'
                conn.send(JSON.stringify({
                  action: 'deliver-file',
                  flags: [],
                  message: naclUtil.encodeBase64(encryptedMessage),
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
    requestFile (id) {
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
        conn.send(JSON.stringify({
          action: 'request-file',
          flags: [],
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
            // File recieved, decrypt.
            store.appStatus = 'Decrypting file...'
            nacl.box.overheadLength = 0
            const uintArray = nacl.box.open(
              naclUtil.decodeBase64(data.message),
              store.nonce,
              naclUtil.decodeBase64(data.authenticationKey),
              store.secretKey
            )
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
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>

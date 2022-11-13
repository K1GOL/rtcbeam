import { reactive } from 'vue'
import { version } from './version.js'

export const store = reactive({
  appStatus: 'Ready.',
  peer: null,
  fileReady: false,
  inboundFile: null,
  outboundFile: null,
  filename: null,
  nonce: null,
  secretKey: null,
  version: version
})

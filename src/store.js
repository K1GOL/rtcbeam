import { reactive } from 'vue'

export const store = reactive({
  appStatus: 'Ready.',
  peer: null,
  fileReady: false,
  inboundFile: null,
  outboundFile: null,
  filename: null,
  nonce: null,
  secretKey: null
})

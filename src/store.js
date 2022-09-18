import { reactive } from 'vue'
import * as p from '../package.json'

export const store = reactive({
  appStatus: 'Ready.',
  peer: null,
  fileReady: false,
  inboundFile: null,
  outboundFile: null,
  filename: null,
  nonce: null,
  secretKey: null,
  version: p.version
})

import { reactive } from 'vue'
import { version } from './version.js'

export const store = reactive({
  appStatus: 'Loading...',
  core: null,
  fileReady: false,
  inboundFile: null,
  latestOutboundCid: null,
  filename: null,
  currentBytes: 0,
  totalBytes: 0,
  percentage: 40,
  version: version
})

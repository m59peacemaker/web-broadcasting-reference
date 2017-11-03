import state from 'purestate'
import flyd from 'flyd'
import ConnectedMediaDevicesStream from './lib/connected-media-devices-stream'
import { normalizeMediaDevices } from './services/media-devices/schema'

const mediaDevices = state(normalizeMediaDevices([]))
mediaDevices(123)

const connectedMediaDevices$ = ConnectedMediaDevicesStream()
  .map(normalizeMediaDevices)
//flyd.on(mediaDevices, connectedMediaDevices$)
setTimeout(() => {
  console.log(mediaDevices())
}, 2000)

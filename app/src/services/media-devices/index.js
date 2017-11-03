import flyd from 'flyd'
import ConnectedMediaDevicesStream from '../../lib/connected-media-devices-stream'
import { normalizeMediaDevices } from './schema'
import Model from './model'

const MediaDevices = update$ => {
  const connectedMediaDevices$ = ConnectedMediaDevicesStream()
    .map(normalizeMediaDevices)

  flyd.on(devices => update$(() => devices), connectedMediaDevices$)
  return {
    model: Model(),
  }
}

export default MediaDevices

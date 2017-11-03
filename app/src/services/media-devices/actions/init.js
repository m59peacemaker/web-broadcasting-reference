import watchMediaDeviceConnections from './watch-media-device-connections'
import { normalizeMediaDevices } from '../schema'

const init = update$ => {
  watchMediaDeviceConnections(
    // TODO: this is quite an awkward way to wrap/map this thing
    // and it doesn't work right now anyway :/
    updateModel => {
      return update$(model => normalizeMediaDevices(updateModel(model)))
    }
  )
}

export default init

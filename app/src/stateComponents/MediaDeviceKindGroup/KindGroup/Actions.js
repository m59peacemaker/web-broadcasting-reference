import pipe from 'ramda/src/pipe'
import append from 'ramda/src/append'
import without from 'ramda/src/without'
import assoc from 'ramda/src/assoc'
import dissoc from 'ramda/src/dissoc'
import tap from 'ramda/src/tap'
import curry from 'ramda/src/curry'
import { MediaDevice } from '../../MediaDevice'

const MediaDeviceKindGroupActions = (
  kind,
  { originStreams, model$, components },
  { getUserMedia, audioContext }
) => {
  const { devices: devices$ } = originStreams
  const makeMediaDevice = info => MediaDevice(info, { getUserMedia, audioContext })

  const registerDevice = deviceInfo => {
    const mediaDevice = makeMediaDevice(deviceInfo)
    components[deviceInfo.deviceId] = mediaDevice
    devices$.update(assoc(deviceInfo.deviceId, mediaDevice.model$))
  }

  const unregisterDevice = ({ deviceId }) => {
    if (model$().devices[deviceId].connected) {
      throw new Error('cannot unregister a device while it is connected')
    }
    delete components[deviceId]
    devices$.update(dissoc(deviceId))
  }

  const notifyOfDeviceConnect = deviceInfo => {
    if (!model$().devices[deviceInfo.deviceId]) {
      registerDevice(deviceInfo)
    }
    components[deviceInfo.deviceId].actions.notifyOfConnect()
  }

  const notifyOfDeviceDisconnect = ({ deviceId }) =>
    components[deviceId].actions.notifyOfDisconnect()

  return {
    registerDevice,
    unregisterDevice,
    notifyOfDeviceConnect,
    notifyOfDeviceDisconnect
  }
}

export {
  MediaDeviceKindGroupActions
}

import { MediaDeviceMasterModel } from '../../MediaDeviceMaster'

const MediaDeviceKindGroupModel = () => ({
  connected: [],
  disconnected: [],
  active: [],
  inactive: [],
  master: MediaDeviceMasterModel(),
  devices: {}
})

export * from './Actions'
export {
  MediaDeviceKindGroupModel
}

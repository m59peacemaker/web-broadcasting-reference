import { MediaDeviceMasterModel } from '../MediaDeviceMaster'

const KindGroupModel = () => ({
  connected: [],
  disconnected: [],
  active: [],
  inactive: [],
  master: MediaDeviceMasterModel(),
  devices: {}
})

export {
  KindGroupModel
}

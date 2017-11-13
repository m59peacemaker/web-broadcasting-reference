import { MediaDeviceMasterModel } from './'
import { VideoinputModelOverlay } from '../MediaDevice/Videoinput'
import mergeDeep from 'deepmerge'

const VideoinputMasterModel = () => mergeDeep.all([
  MediaDeviceMasterModel(),
  VideoinputModelOverlay(),
  {
    kind: 'videoinput'
  }
])

export {
  VideoinputMasterModel
}

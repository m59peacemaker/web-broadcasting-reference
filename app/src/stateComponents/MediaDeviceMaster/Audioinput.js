import { MediaDeviceMasterModel } from './'
import { AudioinputModelOverlay } from '../MediaDevice/Audioinput'
import mergeDeep from 'deepmerge'

const AudioinputMasterModel = () => mergeDeep.all([
  MediaDeviceMasterModel(),
  AudioinputModelOverlay(),
  {
    kind: 'audioinput'
  }
])

export {
  AudioinputMasterModel
}

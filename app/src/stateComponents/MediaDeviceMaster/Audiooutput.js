import { MediaDeviceMasterModel } from './'
import { AudiooutputModelOverlay } from '../MediaDevice/Audiooutput'
import mergeDeep from 'deepmerge'

const AudiooutputMasterModel = () => mergeDeep.all([
  MediaDeviceMasterModel(),
  AudiooutputModelOverlay(),
  {
    kind: 'audiooutput'
  }
])

export {
  AudiooutputMasterModel
}

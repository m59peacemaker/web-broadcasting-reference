import { MediaDeviceMasterModel } from './'
import { AudioinputInitialStateMixin } from '../MediaDevice/Audioinput'
import mergeDeep from 'deepmerge'

const AudioinputMasterModel = () => mergeDeep.all([
  MediaDeviceMasterModel(),
  AudioinputInitialStateMixin(),
  {
    kind: 'audioinput'
  }
])

export {
  AudioinputMasterModel
}

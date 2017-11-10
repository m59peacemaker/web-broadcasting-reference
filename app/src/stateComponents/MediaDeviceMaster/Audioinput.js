import { MediaDeviceMasterModel } from './'
import { AudioinputModelOverlay } from '../MediaDevice/Audioinput'
import mergeDeep from 'deepmerge'

const AudioinputMasterModel = () => mergeDeep(MediaDeviceMasterModel(), AudioinputModelOverlay())

export {
  AudioinputMasterModel
}

import { MediaDeviceMasterModel } from './'
import { AudiooutputModelOverlay } from '../MediaDevice/Audiooutput'
import mergeDeep from 'deepmerge'

const AudiooutputMasterModel = () => mergeDeep(MediaDeviceMasterModel(), AudiooutputModelOverlay())

export {
  AudiooutputMasterModel
}

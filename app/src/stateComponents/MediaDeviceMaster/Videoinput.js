import { MediaDeviceMasterModel } from './'
import { VideoinputModelOverlay } from '../MediaDevice/Videoinput'
import mergeDeep from 'deepmerge'

const VideoinputMasterModel = () => mergeDeep(MediaDeviceMasterModel(), VideoinputModelOverlay())

export {
  VideoinputMasterModel
}

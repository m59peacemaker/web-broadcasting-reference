import { KindGroupModel } from './KindGroup'
import { AudioinputMasterModel } from '../MediaDeviceMaster'
import mergeDeep from 'deepmerge'

const AudioinputKindGroupModel = () => mergeDeep(KindGroupModel(), {
  master: AudioinputMasterModel()
})

export {
  AudioinputKindGroupModel
}

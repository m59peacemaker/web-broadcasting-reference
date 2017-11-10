import { KindGroupModel } from './KindGroup'
import { AudiooutputMasterModel } from '../MediaDeviceMaster'
import mergeDeep from 'deepmerge'

const AudiooutputKindGroupModel = () => mergeDeep(KindGroupModel(), {
  master: AudiooutputMasterModel()
})

export {
  AudiooutputKindGroupModel
}

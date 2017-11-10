import { KindGroupModel } from './KindGroup'
import { VideoinputMasterModel } from '../MediaDeviceMaster'
import mergeDeep from 'deepmerge'

const VideoinputKindGroupModel = () => mergeDeep(KindGroupModel(), {
  master: VideoinputMasterModel()
})

export {
  VideoinputKindGroupModel
}

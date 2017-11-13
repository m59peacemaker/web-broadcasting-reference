import mergeDeep from 'deepmerge'
import { MediaDeviceKindGroupModel, MediaDeviceKindGroupActions } from './KindGroup'
import { AudiooutputMasterModel } from '../MediaDeviceMaster'
import Model$ from '../../lib/ModelStream'

const AudiooutputKindGroupModel = () => mergeDeep(MediaDeviceKindGroupModel(), {
  master: AudiooutputMasterModel()
})

const AudiooutputKindGroupActions = (model$, components, { getUserMedia }) => {
  return Object.assign(
    MediaDeviceKindGroupActions('audiooutput', model$, components, { getUserMedia }),
    {

    }
  )
}

const AudiooutputKindGroup = () => {
  const model$ = Model$(AudiooutputKindGroupModel())
  const components = {}

  return {
    model$,
    actions: AudiooutputKindGroupActions(model$, components, { getUserMedia })
  }
}


export {
  AudiooutputKindGroup,
  AudiooutputKindGroupModel,
  AudiooutputKindGroupActions
}

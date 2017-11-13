import { MediaDeviceKindGroupModel, MediaDeviceKindGroupActions } from './KindGroup'
import { VideoinputMasterModel } from '../MediaDeviceMaster'
import mergeDeep from 'deepmerge'
import Model$ from '../../lib/ModelStream'
import { over } from '../../lib/model-helpers'
import flydObj from 'flyd/module/obj'

const VideoinputKindGroupModel = () => mergeDeep(MediaDeviceKindGroupModel(), {
  master: VideoinputMasterModel()
})

const VideoinputKindGroupActions = (model$, components, { getUserMedia }) => {
  return Object.assign(
    MediaDeviceKindGroupActions('videoinput', model$, components, { getUserMedia }),
    {

    }
  )
}

const VideoinputKindGroup = ({ getUserMedia }) => {
  const components = {}
  const model$ = Model$(VideoinputKindGroupModel(), {
    dynamicChildren: [ 'devices' ]
  })

  return {
    model$,
    components,
    actions: VideoinputKindGroupActions(model$, components, { getUserMedia })
  }
}

export {
  VideoinputKindGroup,
  VideoinputKindGroupModel,
  VideoinputKindGroupActions
}

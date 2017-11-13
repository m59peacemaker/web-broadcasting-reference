import assoc from 'ramda/src/assoc'
import map from 'ramda/src/map'
import prop from 'ramda/src/prop'
import { MediaDeviceKindGroup, MediaDeviceKindGroupModel } from '../MediaDeviceKindGroup'
import { MediaDevicesActions } from './Actions'
import flydObj from 'flyd/module/obj'
import assignStreamHelpers from '../../lib/assign-stream-helpers'

const mediaDeviceKinds = Object.freeze([ 'videoinput', 'audioinput', 'audiooutput' ])

const MediaDevicesModel = () => mediaDeviceKinds.reduce(
  (model, kind) => assoc(kind, MediaDeviceKindGroupModel(kind), model),
  {}
)

const MediaDevices = ({ getUserMedia, audioContext }) => {
  const makeMediaDeviceKindGroup = kind => MediaDeviceKindGroup(kind, {
    getUserMedia,
    audioContext
  })
  const components = mediaDeviceKinds.reduce(
    (components, kind) => assoc(kind, makeMediaDeviceKindGroup(kind), components),
    {}
  )
  const componentModels = map(prop('model$'), components)
  // TODO: flydObj.stream is unnecessarily recursive. prefer combineLatestObj? or something
  const model$ = assignStreamHelpers(flydObj.stream(componentModels))

  return {
    model$,
    components,
    actions: MediaDevicesActions(model$, components)
  }
}

export default MediaDevices

export {
  MediaDevices,
  MediaDevicesModel,
  mediaDeviceKinds
}

import mergeDeep from 'deepmerge'
import { MediaDeviceKindGroupModel, MediaDeviceKindGroupActions } from './KindGroup'
import { AudioinputMasterModel } from '../MediaDeviceMaster'
import assignStreamHelpers from '../../lib/assign-stream-helpers'
import flydObj from 'flyd/module/obj'
import filterStream from 'flyd/module/filter'

const AudioinputKindGroupModel = () => mergeDeep(MediaDeviceKindGroupModel(), {
  master: AudioinputMasterModel()
})

const AudioinputKindGroupActions = (model$, components, { getUserMedia }) => {
  return Object.assign(
    MediaDeviceKindGroupActions('audioinput', model$, components, { getUserMedia }),
    {

    }
  )
}

const groupFilterPredicates = {
  connected: path([ 'state', 'connected' ]),
  disconnected: compose(not, path([ 'state', 'connected' ])),
  active: path([ 'state', 'active' ]),
  inactive: compose(not, path([ 'state', 'active' ]))
}

const ComputedStreams = ({ devices$ }, components) => map(
  predicate => filterStream(groupFilterPredicates, devices$).map(device => device.deviceId),
  groupFilterPredicates
)

const AudioinputKindGroup = ({ getUserMedia, audioContext }) => {
  const originStreams = map(assignStreamHelpers, {
    devices: withStreamsFromObjectValues({}),
  })
  /* Master takes a stream of components that are active devices
    devices.model$.map(state =>
      state.active.map(deviceId => devices.components[deviceId])
    )
    I think it should combine all the tracks into one and just mute/monitor itself
    muting input tracks would mute them in it
    the consumer should just output master if they want master.mute to mute all of them, but they can do as they wish
    output individuals when monitoring, though
    so all master needs to do is to form a track and control it, I think

    video master:
      compose tracks with canvas.captureStream if supported, if not, disallow multiple video sources?
      have settings for how to compose tracks, default to square in corner
  */
  const components = {
    devices: { },
    master: AudioinputMaster(originStreams.devices)
  }
  const computedStreams = ComputedStreams(originStreams)

  const model$ = flydObj.stream(
    Object.assign(streams, computedStreams, { master: components.master.model$ })
  )

  const instance = {
    model$,
    components,
    originStreams
  }
  instance.actions = AudioinputKindGroupActions(instance, { getUserMedia, audioContext })
  return instance
}

export {
  AudioinputKindGroup,
  AudioinputKindGroupModel,
  AudioinputKindGroupActions
}

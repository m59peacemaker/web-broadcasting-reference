import pipe from 'ramda/src/pipe'
import { set, merge, toggle } from '../../../lib/model-helpers'
import makeConstraints from './lib/make-audioinput-constraints-from-settings'
import { MediaDeviceActions } from '../Device'
import TrackVolume$ from '../../../lib/TrackVolumeStream'

const Errors = {
  activateWhileNotConnected: model =>
    `audioinput ${model.label} (${model.deviceId}) cannot be activated because it is not connected`
}

const AudioinputActions = (originStreams, { getUserMedia, audioContext }) => {
  const { state$, settings$ } = originStreams
  const activate = () => {
    /* TODO: what if this is called while already activating?
      - cancel last?
      - ignore new?
     */
    const model = model$()

    if (!model.state.connected) {
      throw new Error(Errors.activateWhileNotConnected(model))
    }

    state$.update(merge({
      activating: true,
      error: null
    }))
    return getUserMedia({ audio: makeConstraints(model.deviceId, model.settings) })
      .then(stream => {
        const track = stream.getTracks()[0]
        track.enabled = !model$().settings.muted
        state$.update(merge({
          track,
          volume: TrackVolume$(audioContext, track),
          active: true,
          activating: false
        }))
      })
      .catch(err => {
        state$.update(set('error', err))
        deactivate()
      })
  }

  const deactivate = () => {
    const { state } = model$()
    state.track && state.track.stop()
    state$.update(merge({
      track: null,
      active: false,
      volume: 0
    }))
  }

  const setMuted = bool => model$.update(model => {
    model.state.track.enabled = bool
    return set('muted', bool, model)
  })
  const mute = () => setMuted(true)
  const unMute = () => setMuted(false)
  const toggleMuted = () => model$().settings.muted
    ? unMute()
    : mute()

  const setMonitoring = bool => settings$.update(set('monitoring', bool))
  const monitor = () => setMonitoring(true)
  const stopMonitoring = () => setMonitoring(false)
  const toggleMonitoring = () => model$().settings.monitoring
    ? monitor()
    : stopMonitoring()

  return Object.assign(MediaDeviceActions('audioinput', model$), {
    activate,
    deactivate,
    mute,
    unMute,
    toggleMuted,
    monitor,
    stopMonitoring,
    toggleMonitoring
  })
}

export {
  AudioinputActions
}

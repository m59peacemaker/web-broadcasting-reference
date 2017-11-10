import pipe from 'ramda/src/pipe'
import merge from 'ramda/src/merge'
import { over, set, toggle, toTrue, toFalse } from '../../../lib/model-helpers'

const Errors = {
  activateNotConnected: model =>
    `audioinput ${model.label} (${model.deviceId}) cannot be activated because it is not connected`
}

const makeConstraints = () => {
  return {}
}

export default (model$, { getUserMedia }) => {
  const activate = () => {
    /* TODO: what if this is called while already activating?
      - cancel last?
      - ignore new?
     */
    const model = model$()

    if (!model.state.connected) {
      throw new Error(Errors.activateNotConnected(model))
    }

    model$.update(pipe(
      toTrue([ 'state', 'activating' ]),
      set([ 'state', 'error' ], null)
    ))
    return getUserMedia({ audio: makeConstraints(model$().settings) })
      .then(stream => {
        const track = stream.getTracks()[0]
        track.enabled = model$().settings.muted
        model$.update(pipe(
          set([ 'state', 'track' ], track),
          toTrue([ 'state', 'active' ]),
          toFalse([ 'state', 'activating' ])
        ))
      })
      .catch(err => {
        model$.update(set([ 'state', 'error' ], err))
        deactivate()
      })
  }

  const deactivate = () => {
    const { state } = model$()
    state.track && state.track.stop()
    model$.update(over(
      'state',
      state => merge(state, {
        track: null,
        active: false,
        volume: 0
      })
    ))
  }

  const setMuted = bool => model$.update(model => {
    model.state.track.enabled = bool
    return set([ 'settings', 'muted' ], bool, model)
  })
  const mute = () => setMuted(true)
  const unMute = () => setMuted(false)
  const toggleMuted = () => model$().settings.muted
    ? unMute()
    : mute()

  const setMonitoring = bool => model$.update(set([ 'settings', 'monitoring' ], bool))
  const monitor = () => setMonitoring(true)
  const stopMonitoring = () => setMonitoring(false)
  const toggleMonitoring = () => model$().settings.monitoring
    ? monitor()
    : stopMonitoring()

  const setConnected = bool => model$.update(set([ 'state', 'connected' ], bool))

  return {
    activate,
    deactivate,
    mute,
    unMute,
    toggleMuted,
    monitor,
    stopMonitoring,
    toggleMonitoring,
    setConnected
  }
}

import * as W from 'wark'
import pipe from 'ramda/src/pipe'

const createEffectRequests = ({ model, sources }) => {
  const { actions, messages } = sources

  const keepWhenHasTrack = W.keepWhen (model.state.track)

  // inputdevice
  const applyConstraintsRq$ = pipe
    (
      keepWhenHasTrack,
      W.map (constraints => ({
        action: 'applyConstraints',
        track: model.state.track.get(),
        constraints
      }))
    )
    (model.settings.mediaConstraints)

  /* TODO:
      merging applyConstraints requests here until audioTrack.applyConstraints is supported
      for now, a new track has to be fetched
   */
   // inputdevice
  const userMediaTrackRq$ = pipe
    (
      W.merge,
      W.map (() => ({
        constraints: { audio: model.settings.mediaConstraints.get() },
        success: messages.userMediaTrack,
        error: messages.userMediaTrackError
      }))
    )
    ([ actions.activate, applyConstraintsRq$ ])

  // inputdevice
  const stopTrackRq$ = pipe
    (
      W.merge,
      W.withLatestFrom ([ model.state.track ]),
      W.map (([ _, track ]) => ({ track, action: 'stop' }))
    )
    ([
      actions.deactivate,
      applyConstraintsRq$ // TODO: this is temporary! (awaiting track.applyConstraints() support)
    ])

  const trackMuteAdjustRq$ = pipe
    (
      keepWhenHasTrack,
      W.withLatestFrom ([ model.state.track ]),
      W.map (([ muted, track ]) => ({ track, action: muted ? 'mute' : 'unMute' }))
    )
    (model.settings.muted)

  return {
    userMediaTrack: userMediaTrackRq$,

    audioTrackManager: W.merge([
      stopTrackRq$,
      trackMuteAdjustRq$,
      applyConstraintsRq$
    ]),

    audioTrackPlayer: pipe
      (
        W.combineObject,
        W.scan
          (previousRequest => ({ monitoring, track }) => ({
            action: (monitoring && track) ? 'play' : 'stop',
            track: track || previousRequest.track
          }))
          ({ action: null, track: null })
      )
      ({ monitoring: model.settings.monitoring, track: model.state.track }),

    // inputdevice
    deviceConnectionNotifier: W.Stream({
      kind: model.kind,
      deviceId: model.deviceId,
      onConnect: messages.deviceConnection,
      onDisconnect: messages.deviceDisconnection
    })
  }
}

export default createEffectRequests

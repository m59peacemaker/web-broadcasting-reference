import flyd from 'flyd'
import keepWhen from 'flyd/module/keepwhen'
import merge from 'flyd/module/mergeall'
import withLatestFrom from 'flyd-withlatestfrom'
import pipe from 'ramda/src/pipe'

const createEffectRequests = ({ model, sources }) => {
  const { actions, messages } = sources

  const keepWhenHasTrack = keepWhen(model.state.track.map(track => track || false))

  // inputdevice
  const applyConstraintsRq$ = pipe(
    keepWhenHasTrack,
    flyd.map(constraints => ({
      action: 'applyConstraints',
      track: model.state.track(),
      constraints
    }))
  )(model.settings.mediaConstraints)

  /* TODO:
      merging applyConstraints requests here until audioTrack.applyConstraints is supported
      for now, a new track has to be fetched
   */
   // inputdevice
  const userMediaTrackRq$ = merge([
    actions.activate,
    applyConstraintsRq$
  ])
    .map(() => ({
      constraints: { audio: model.settings.mediaConstraints() },
      success: messages.userMediaTrack,
      error: messages.userMediaTrackError
    }))

  // inputdevice
  const stopTrackRq$ = pipe(
    merge,
    withLatestFrom([ model.state.track ]),
    flyd.map((_, track) => ({
      track,
      action: 'stop'
    }))
  )([
    actions.deactivate,
    applyConstraintsRq$ // TODO: this is temporary! (awaiting track.applyConstraints() support)
  ])

  const trackMuteAdjustRq$ = pipe(
    keepWhenHasTrack,
    withLatestFrom([ model.state.track ]),
    flyd.map(([ muted, track ]) => ({
      track,
      action: muted ? 'mute' : 'unMute'
    }))
  )(model.settings.muted)

  return {
    userMediaTrack: userMediaTrackRq$,

    audioTrackManager: merge([
      stopTrackRq$,
      trackMuteAdjustRq$,
      applyConstraintsRq$
    ]),

    audioTrackPlayer: pipe(
      flyd.combine(
        (monitoring, track) => ({ monitoring: monitoring(), track: track() })
      ),
      flyd.scan(
        (previousRequest, { monitoring, track }) => ({
          action: (monitoring && track) ? 'play' : 'stop',
          track: track || previousRequest.track
        }),
        { action: null, track: null }
      )
    )([ model.settings.monitoring, model.state.track ]),

    // inputdevice
    deviceConnectionNotifier: flyd.stream({
      kind: model.kind,
      deviceId: model.deviceId,
      onConnect: messages.deviceConnection,
      onDisconnect: messages.deviceDisconnection
    })
  }
}

export default createEffectRequests

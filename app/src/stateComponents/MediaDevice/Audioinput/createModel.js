import flyd from 'flyd'
import flydObj from 'flyd/module/obj'
import filter from 'flyd/module/filter'
import merge from 'flyd/module/mergeall'
import scanMerge from 'flyd/module/scanmerge'
import switchLatest from 'flyd/module/switchlatest'

import atPath from 'ramda/src/path'
import not from 'ramda/src/not'
import T from 'ramda/src/T'
import F from 'ramda/src/F'
import flip from 'ramda/src/flip'
import identity from 'ramda/src/identity'
import pipe from 'ramda/src/pipe'
import pick from 'ramda/src/pick'
import over from 'ramda/src/over'
import lensProp from 'ramda/src/lensProp'
import prop from 'ramda/src/prop'

import { AudioinputInitialState, AudioinputProcessingModeConfigs } from './InitialState'
import makeMediaDeviceInfoIntoNormalObject from '../lib/make-media-device-into-normal-object'

const toNull = () => null

const createModel = ({ mediaDeviceInfo, sources }) => {
  const deviceInfo = makeMediaDeviceInfoIntoNormalObject(mediaDeviceInfo)

  const { actions, messages } = sources

  const init = flyd.stream(AudioinputInitialState())

  const deviceConnected = merge([
    init.map(atPath([ 'state', 'connected' ])),
    messages.deviceConnection
  ])

  const deviceDisconnect = filter(not, deviceConnected)

  const state = {
    // mediadevice
    connected: deviceConnected,

    /* inputdevice */
    active: merge([
      init.map(atPath([ 'state', 'active' ])),
      messages.userMediaTrack.map(T),
      actions.deactivate.map(F),
      deviceDisconnect.map(F)
    ]),

    activating: merge([
      init.map(atPath([ 'state', 'activating' ])),
      actions.activate.map(T),
      messages.userMediaTrack.map(F),
      messages.userMediaTrackError.map(F),
      deviceDisconnect.map(F)
    ]),

    deviceError: merge([
      init.map(atPath([ 'state', 'error' ])),
      messages.userMediaTrack.map(toNull),
      messages.userMediaTrackError,
      actions.activate.map(toNull),
      deviceDisconnect.map(toNull)
    ]),

    track: merge([
      init.map(atPath([ 'state', 'track' ])),
      deviceDisconnect.map(toNull),
      actions.deactivate.map(toNull),
      messages.userMediaTrack
    ]),
    /* fin inputdevice */

    // audioinput
    volume: merge([
      init.map(atPath([ 'state', 'volume' ])),
      deviceDisconnect.map(() => 0),
      actions.deactivate.map(() => 0),
      messages.trackVolume
    ])
  }

  const settings = {
    gain: merge([
      init.map(atPath([ 'settings', 'gain' ])),
      actions.setGain
    ]),

    muted: scanMerge([
      [ init, (_, init) => atPath([ 'settings', 'muted' ], init) ],
      [ actions.mute, T ],
      [ actions.unMute, F ],
      [ actions.toggleMute, not ]
    ], false),

    monitoring: scanMerge([
      [ init.map(atPath([ 'settings', 'monitoring' ])), flip(identity) ],
      [ actions.monitor, T ],
      [ actions.stopMonitoring, F ],
      [ actions.toggleMonitoring, not ]
    ], false),

    stereo: scanMerge([
      [ init.map(atPath([ 'settings', 'stereo' ])), flip(identity) ],
      [ actions.enableStereo, T ],
      [ actions.disableStereo, F ],
      [ actions.toggleStereo, not ]
    ], true),

    processing: {
      mode: merge([
        init.map(atPath([ 'settings', 'processing', 'mode' ])),
        actions.setProcessingMode
      ]),

      custom: {
        echoCancellation: scanMerge([
          [
            init.map(atPath([ 'settings', 'processing', 'custom', 'echoCancellation' ])),
            flip(identity)
          ],
          [ actions.enableEchoCancellation, T ],
          [ actions.disableEchoCancellation, F ],
          [ actions.toggleEchoCancellation, not ]
        ], true),

        noiseSuppression: scanMerge([
          [
            init.map(atPath([ 'settings', 'processing', 'custom', 'noiseSuppression' ])),
            flip(identity)
          ],
          [ actions.enableNoiseSuppression, T ],
          [ actions.disableNoiseSuppression, F ],
          [ actions.toggleNoiseSuppression, not ]
        ], true),

        autoGainControl: scanMerge([
          [
            init.map(atPath([ 'settings', 'processing', 'custom', 'autoGainControl' ])),
            flip(identity)
          ],
          [ actions.enableAutoGainControl, T ],
          [ actions.disableAutoGainControl, F ],
          [ actions.toggleAutoGainControl, not ]
        ], true)
      }
    }
  }

  const custom = flydObj.stream(settings.processing.custom)
  const modeConfigStream = flyd.map(
    mode => mode === 'custom'
      ? custom
      : flyd.stream(AudioinputProcessingModeConfigs[mode]())
    ,
    settings.processing.mode
  )

  settings.processing.modeConfig = merge([
    switchLatest(modeConfigStream),
    modeConfigStream.map(stream => stream())
  ])

  const settingsThatAffectConstraints = pipe(
    pick([ 'stereo', 'processing' ]),
    over(lensProp('processing'), prop('modeConfig'))
  )(settings)

  settings.mediaConstraints = flydObj.stream(settingsThatAffectConstraints)
    .map(settings => {
      const { stereo, processing } = settings
      return Object.assign(
        {
          deviceId: deviceInfo.deviceId,
          channelCount: stereo ? 2 : 1
        },
        processing
      )
    })

  return Object.assign(
    flydObj.streamProps(deviceInfo),
    { state, settings }
  )
}

export default createModel

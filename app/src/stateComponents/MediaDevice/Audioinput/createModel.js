import * as W from 'wark'

import propPath from 'ramda/src/path'
import not from 'ramda/src/not'
import T from 'ramda/src/T'
import F from 'ramda/src/F'
import pipe from 'ramda/src/pipe'
import pick from 'ramda/src/pick'
import over from 'ramda/src/over'
import lensProp from 'ramda/src/lensProp'
import prop from 'ramda/src/prop'

import { AudioinputInitialState, AudioinputProcessingModeConfigs } from './InitialState'
import makeMediaDeviceInfoIntoNormalObject from '../lib/make-media-device-into-normal-object'

const Null = () => null

const createModel = ({ mediaDeviceInfo, sources }) => {
  const deviceInfo = makeMediaDeviceInfoIntoNormalObject(mediaDeviceInfo)

  const { actions, messages } = sources

  const init = W.Stream(AudioinputInitialState())

  const state = {
    // mediadevice
    connected: W.merge([
      W.map (propPath([ 'state', 'connected' ])) (init),
      W.map (T) (messages.deviceConnection),
      W.map (F) (messages.deviceDisconnection)
    ]),

    /* inputdevice */
    active: W.merge([
      W.map (propPath([ 'state', 'active' ])) (init),
      W.map (T) (messages.userMediaTrack),
      W.map (F) (actions.deactivate),
      W.map (F) (messages.deviceDisconnection)
    ]),

    activating: W.merge([
      W.map (propPath([ 'state', 'activating' ])) (init),
      W.map (T) (actions.activate),
      W.map (F) (messages.userMediaTrack),
      W.map (F) (messages.userMediaTrackError),
      W.map (F) (messages.deviceDisconnection)
    ]),

    deviceError: W.merge([
      W.map (propPath([ 'state', 'error' ])) (init),
      W.map (Null) (messages.userMediaTrack),
      messages.userMediaTrackError,
      W.map (Null) (actions.activate),
      W.map (Null) (messages.deviceDisconnection)
    ]),

    track: W.merge([
      W.map (propPath([ 'state', 'track' ])) (init),
      W.map (Null) (messages.deviceDisconnection),
      W.map (Null) (actions.deactivate),
      messages.userMediaTrack
    ]),
    /* fin inputdevice */

    // audioinput
    volume: W.merge([
      W.map (propPath([ 'state', 'volume' ])) (init),
      W.map (() => 0) (messages.deviceDisconnection),
      W.map (() => 0) (actions.deactivate),
      messages.trackVolume
    ])
  }

  const settings = {
    gain: W.merge([
      W.map (propPath([ 'settings', 'gain' ])) (init),
      actions.setGain
    ]),

    muted: W.scanMerge
      ([
        W.map (propPath([ 'settings', 'muted' ])) (init),
        W.map (T) (actions.mute),
        W.map (F) (actions.unMute),
        [ actions.toggleMute, not ]
      ])
      (false),

    monitoring: W.scanMerge
      ([
        W.map (propPath([ 'settings', 'monitoring' ])) (init),
        W.map (T) (actions.monitor),
        W.map (F) (actions.stopMonitoring),
        [ actions.toggleMonitoring, not ]
      ])
      (false),

    stereo: W.scanMerge
      ([
        W.map (propPath([ 'settings', 'stereo' ])) (init),
        W.map (T) (actions.enableStereo),
        W.map (F) (actions.disableStereo),
        [ actions.toggleStereo, not ]
      ])
      (true),

    processing: {
      mode: W.merge([
        W.map (propPath([ 'settings', 'processing', 'mode' ])) (init),
        actions.setProcessingMode
      ]),

      custom: {
        echoCancellation: W.scanMerge
          ([
            W.map (propPath([ 'settings', 'processing', 'custom', 'echoCancellation' ])) (init),
            W.map (T) (actions.enableEchoCancellation),
            W.map (F) (actions.disableEchoCancellation),
            [ actions.toggleEchoCancellation, not ]
          ])
          (true),

        noiseSuppression: W.scanMerge
          ([
            W.map (propPath([ 'settings', 'processing', 'custom', 'noiseSuppression' ])) (init),
            W.map (T) (actions.enableNoiseSuppression),
            W.map (F) (actions.disableNoiseSuppression),
            [ actions.toggleNoiseSuppression, not ]
          ])
          (true),

        autoGainControl: W.scanMerge
          ([
            W.map (propPath([ 'settings', 'processing', 'custom', 'autoGainControl' ])) (init),
            W.map (T) (actions.enableAutoGainControl),
            W.map (F) (actions.disableAutoGainControl),
            [ actions.toggleAutoGainControl, not ]
          ])
          (true)
      }
    }
  }

  settings.processing.modeConfig = pipe
    (
      W.map
        (mode => mode === 'custom'
          ? W.combineObject(settings.processing.custom)
          : W.Stream(AudioinputProcessingModeConfigs[mode]())
        ),
      W.switchImmediate
    )
    (settings.processing.mode)

  const settingsThatAffectConstraints = pipe
    (
      pick([ 'stereo', 'processing' ]),
      over(lensProp('processing'), prop('modeConfig'))
    )
    (settings)

  settings.mediaConstraints = pipe
    (
      W.combineObject,
      W.map
        (settings => {
          const { stereo, processing } = settings
          return Object.assign(
            {
              deviceId: deviceInfo.deviceId,
              channelCount: stereo ? 2 : 1
            },
            processing
          )
        })
    )
    (settingsThatAffectConstraints)

  return {
    ...deviceInfo,
    state,
    settings
  }
}

export default createModel

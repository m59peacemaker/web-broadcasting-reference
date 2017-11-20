import { InputDeviceInitialState } from '../InputDevice'
import mergeDeep from 'ramda/src/mergeDeepRight'

const voice = () => ({
  echoCancellation: true,
  noiseSuppression: true,
  autoGainControl: true
})

const AudioinputProcessingModeConfigs = {
  voice,
  ambient: () => ({
    echoCancellation: true,
    noiseSuppression: false,
    autoGainControl: false
  }),
  custom: voice
}

const AudioinputInitialStateMixin = () => ({
  state: {
    volume: 0,
    track: null
  },
  settings: {
    muted: false,
    monitoring: false,
    gain: 1,
    stereo: true,
    processing: {
      mode: 'voice',
      custom: AudioinputProcessingModeConfigs.custom()
    }
  }
})

const AudioinputInitialState = () => mergeDeep(
  InputDeviceInitialState(),
  AudioinputInitialStateMixin()
)

export {
  AudioinputInitialState,
  AudioinputInitialStateMixin,
  AudioinputProcessingModeConfigs
}

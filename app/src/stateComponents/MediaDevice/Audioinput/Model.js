import { MediaDeviceModel } from '../'
import mergeDeep from 'deepmerge'

const AudioinputProcessingModeModels = {
  voice: () => ({
    echoCancellation: true,
    noiseSuppression: true,
    autoGainControl: true
  }),
  ambient: () => ({
    echoCancellation: true,
    noiseSuppression: false,
    autoGainControl: false
  })
}

const AudioinputModelOverlay = () => ({
  state: {
    volume: 0,
    track: null
  },
  settings: {
    muted: false,
    gain: 1,
    stereo: true,
    processing: {
      mode: 'voice',
      custom: AudioinputProcessingModeModels.voice() // default custom settings
    }
  }
})

const AudioinputModel = () => mergeDeep(MediaDeviceModel(), AudioinputModelOverlay())

export {
  AudioinputModel,
  AudioinputModelOverlay,
  AudioinputProcessingModeModels
}

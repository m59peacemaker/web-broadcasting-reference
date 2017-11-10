import { MediaDeviceModel } from '../'
import mergeDeep from 'deepmerge'

const AudioinputProcessingModes = {
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
      custom: AudioinputProcessingModes.voice() // default custom settings
    }
  }
})

const AudioinputModel = () => mergeDeep(MediaDeviceModel(), AudioinputModelOverlay())

export {
  AudioinputModel,
  AudioinputModelOverlay,
  AudioinputProcessingModes
}

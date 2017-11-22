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

const AudioinputInitialState = () => ({
  state: {
    connected: false,
    activating: false,
    active: false,
    deviceError: null,

    track: null,

    volume: 0
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

export {
  AudioinputInitialState,
  AudioinputProcessingModeConfigs
}

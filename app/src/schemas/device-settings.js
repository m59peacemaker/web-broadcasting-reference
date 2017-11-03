import audioProcessingModes from './audio-processing-modes'

export default {
  videoinput: () => ({

  }),
  audioinput: () => ({
    muted: false,
    monitor: false,
    gain: 1,
    stereo: true,
    processing: {
      mode: 'voice', // voice, ambient, custom
      custom: audioProcessingModes.voice // default custom settings
    }
  }),
  audiooutput: () => ({

  })
}

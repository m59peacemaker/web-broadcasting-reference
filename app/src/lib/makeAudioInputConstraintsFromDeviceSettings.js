import audioProcessingModes from './audio-processing-modes'

const makeAudioInputConstraintsFromDeviceSettings = (deviceId, deviceSettings) => {
  const { stereo, processing } = deviceSettings
  return Object.assign(
    {
      deviceId,
      channelCount: stereo ? 2 : 1
    },
    processing.mode === 'custom'
      ? processing.custom
      : audioProcessingModes[processing.mode]
  )
}

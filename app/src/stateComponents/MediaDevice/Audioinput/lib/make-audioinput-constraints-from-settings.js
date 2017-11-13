import { AudioinputProcessingModeModels } from '../Model'

const makeAudioinputConstraintsFromSettings = (deviceId, settings) => {
  const { stereo, processing } = settings
  return Object.assign(
    {
      deviceId,
      channelCount: stereo ? 2 : 1
    },
    processing.mode === 'custom'
      ? processing.custom
      : AudioinputProcessingModeModels[processing.mode]()
  )
}

export default makeAudioinputConstraintsFromSettings

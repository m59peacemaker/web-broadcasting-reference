import { MediaDeviceModel } from '../'
import mergeDeep from 'deepmerge'

const AudiooutputModelOverlay = () => ({
  state: {

  },
  settings: {

  }
})

const AudiooutputModel = () => mergeDeep(MediaDeviceModel(), AudiooutputModelOverlay())

export {
  AudiooutputModel,
  AudiooutputModelOverlay
}

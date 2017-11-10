import { MediaDeviceModel } from '../'
import mergeDeep from 'deepmerge'

const VideoinputModelOverlay = () => ({
  state: {
    disabled: false,
    track: null
  },
  settings: {

  }
})

const VideoinputModel = () => mergeDeep(MediaDeviceModel(), VideoinputModelOverlay())

export {
  VideoinputModel,
  VideoinputModelOverlay
}

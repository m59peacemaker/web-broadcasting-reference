import { MediaDeviceModel } from '../'
import mergeDeep from 'deepmerge'

export default () => deepmerge(MediaDeviceModel(), {
  state: {
    disabled: false,
    track: null
  },
  settings: {}
})

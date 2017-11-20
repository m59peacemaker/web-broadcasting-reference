import mergeDeep from 'ramda/src/mergeDeepRight'

const MediaDeviceInfo = () => ({
  deviceId: '',
  groupId: '',
  kind: '',
  label: ''
})

const MediaDeviceInitialState = (kindDeviceInitialState = {}) => mergeDeep(
  MediaDeviceInfo(),
  {
    state: {
      connected: false,
      activating: false,
      active: false,
      deviceError: null
    },
    settings: {}
  },
  kindDeviceInitialState
)

export {
  MediaDeviceInitialState,
  MediaDeviceInfo
}

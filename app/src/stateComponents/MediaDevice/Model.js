const MediaDeviceInfoModel = () => ({
  deviceId: '',
  groupId: '',
  kind: '',
  label: ''
})

export default () => Object.assign(MediaDeviceInfoModel(), {
  state: {
    connected: false,
    activating: false,
    active: false,
    error: null
  },
  settings: {}
})

export {
  MediaDeviceInfoModel
}

const MediaDeviceInfoModel = () => ({
  deviceId: '',
  groupId: '',
  kind: '',
  label: ''
})

const MediaDeviceModel = () => Object.assign(MediaDeviceInfoModel(), {
  state: {
    connected: false,
    activating: false,
    active: false,
    error: null
  },
  settings: {}
})

export {
  MediaDeviceInfoModel,
  MediaDeviceModel
}

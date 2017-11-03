const MediaDeviceModel = () => ({
  deviceId: '',
  groupId: '',
  kind: '',
  label: '',
})

const MediaDeviceStateModel = () => ({
  connected: false,
  active: false
})

const AudioInputStateModel = () => Object.assign(MediaDeviceStateModel(), {
  volume: 0,
  muted: false
})

const VideoInputStateModel = () => Object.assign(MediaDeviceStateModel(), {
  disabled: false
})

const AudioInputModel = () => assign(MediaDeviceModel(), {
  state: AudioInputStateModel()
})

const VideoInputModel = () => assign(MediaDeviceModel(), {
  state: VideoInputStateModel()
})

const Model = () => ({
  videoinput: {},
  audioinput: {},
  audiooutput: {}
})

export default Model

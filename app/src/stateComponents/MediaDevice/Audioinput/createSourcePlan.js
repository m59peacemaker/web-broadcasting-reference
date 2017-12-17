import { AudioinputProcessingModeConfigs } from './InitialState'

export default ({ model, destroy }) => ({
  actions: {
    destroy,
    /* inputdevice */
    activate: () => {
      if (!model.state.connected.get()) {
        return new Error(`audioinput ${model.label} (${model.deviceId}) is not connected`)
      }
    },
    deactivate: null,
    /* fin inputdevice */

    mute: null,
    unMute: null,
    toggleMute: null,
    monitor: null,
    stopMonitoring: null,
    toggleMonitoring: null,
    enableStereo: null,
    disableStereo: null,
    toggleStereo: null,
    enableEchoCancellation: null,
    disableEchoCancellation: null,
    toggleEchoCancellation: null,
    enableNoiseSuppression: null,
    disableNoiseSuppression: null,
    toggleNoiseSuppression: null,
    enableAutoGainControl: null,
    disableAutoGainControl: null,
    toggleAutoGainControl: null,
    setGain: gain => {
      const gainNumber = Number(gain)
      if (typeof gainNumber !== 'number') {
        return new Error('gain should be a number')
      }
      return gainNumber
    },
    setProcessingMode: mode => {
      if (!Object.keys(AudioinputProcessingModeConfigs).includes(mode)) {
        return new Error(`invalid processing mode "${mode}"`)
      }
      return mode
    },
    destroy: null
  },
  messages: {
    trackVolume: null,
    /* inputdevice */
    userMediaTrack: null,
    userMediaTrackError: null,
    /* fin inputdevice */
    // mediadevice
    deviceConnection: null,
    deviceDisconnection: null
  }
})

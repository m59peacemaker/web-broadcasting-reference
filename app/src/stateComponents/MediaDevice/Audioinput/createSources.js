import createSources from '../../../lib/createSources'
import { AudioinputProcessingModeConfigs } from './InitialState'

export default ({ model }) => {
  /*
    these sanitizers probably should just be offering some type safety
    and making sure that the sources aren't called in certain situations / at certain times that don't make sense
    These would just be developer errors in the code interacting with the component, not the kind of thing where the state needs to be used as something the application itself actually cares about.
  */
  return createSources({
    actions: {
      /* inputdevice */
      activate: () => {
        if (!model.state.connected()) {
          return new Error(`audioinput ${model.label()} (${model.deviceId()}) is not connected`)
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
      deviceConnection: null
    }
  })
}

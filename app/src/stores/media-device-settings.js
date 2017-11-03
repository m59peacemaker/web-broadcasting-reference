/* [deviceId] => {}
  master audio
  master video
  keep in localStorage
  active: {
    // order matters
    audioinput: [ deviceId, deviceId ],
    videoinput: [ deviceId ]
  }

  this knows what the user wants activated. Something else should try to activate them accordingly
  if a device is missing or not working, that other thing could remove it from the settings,
  but maybe better to keep it and display an error UI on it with helpful info (your device is missing or borked)
*/
import createStore from './create-store'

const DeviceSettings = {
  audioinput: () => ({
    muted: false,
    gain: 1,
    stereo: true,
    processing: {
      noiseSuppression: true,
      echoCancellation: true,
      autoGainControl: true
    }
  }),
  videoinput: () => ({

  })
}

const store = createStore({
  devices: {},
  master: {
    audioinput: DeviceSettings.audioinput(),
    videoinput: DeviceSettings.videoinput()
  }
})

const deviceIsActive = async deviceId => {
  const device = await devices.get(deviceId)
  store.d
}

export default store

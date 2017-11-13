//import App from './App.html'
import flyd from 'flyd'
const getUserMedia = constraints => window.navigator.mediaDevices.getUserMedia(constraints)
const audioContext = new AudioContext()
import { MediaDevices } from './stateComponents/MediaDevices'
import MediaDeviceConnectionEvents from './lib/media-device-connection-events'
/*
import { Audioinput } from './stateComponents/MediaDevice'
const ai = Audioinput({ deviceId: 'default', kind: 'audioinput' }, { getUserMedia, audioContext })
ai.model$.subscribe(model => console.log(model.state.volume))
ai.actions.notifyOfConnect()
ai.actions.activate()
*/

const mediaDevices = MediaDevices({ getUserMedia, audioContext })
mediaDevices.model$.subscribe(console.log)

const deviceConnectionEvents = MediaDeviceConnectionEvents()
deviceConnectionEvents.on('connected', mediaDevices.actions.notifyOfDeviceConnect)
deviceConnectionEvents.on('disconnected', mediaDevices.actions.notifyOfDeviceDisconnect)
// TODO: do something with these errors
deviceConnectionEvents.on('error', console.log)

// TODO: this could be inside of App.html
const init = () => {
  const appContext = { mediaDevices }

  const app = new App({
    target: document.getElementById('app'),
    data: { appContext }
  })
}

//init()

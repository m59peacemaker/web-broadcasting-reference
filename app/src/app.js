//import App from './App.html'
//import MediaDevices from './stateComponents/MediaDevices'
import ConnectedMediaDevices$ from './lib/connected-media-devices-stream'
import { Audioinput } from './stateComponents/MediaDevice'
const getUserMedia = constraints => window.navigator.mediaDevices.getUserMedia(constraints)
import flyd from 'flyd'

const model$ = flyd.stream()
const audioinput = Audioinput(model$, { getUserMedia })
window.audioinput = audioinput
// TODO: this actually ought to be inside of App.html
const init = () => {
  const connectedDevices$ = ConnectedMediaDevices$()
  const mediaDevices = MediaDevices({ connectedDevices$ })
  const appContext = { mediaDevices }

  const app = new App({
    target: document.getElementById('app'),
    data: { appContext }
  })
}

//init()

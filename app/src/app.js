import App from './viewComponents/App.html'
import MediaDevices from './stateComponents/MediaDevices'
import RequestSink from './RequestSink'

const requestSink = RequestSink()
const mediaDevices = MediaDevices({ sink: requestSink })

const init = () => {
  const appContext = { mediaDevices }

  const app = new App({
    target: document.getElementById('app'),
    data: { appContext }
  })
}

init()

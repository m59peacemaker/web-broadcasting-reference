import App from './viewComponents/App.html'
import RequestSink from './RequestSink'
import MediaDevices from './stateComponents/MediaDevices'

const init = () => {
  const requestSink = RequestSink()
  const mediaDevices = MediaDevices({ sink: requestSink })
  const appContext = { mediaDevices }

  const app = new App({
    target: document.getElementById('app'),
    data: { appContext }
  })
}

init()

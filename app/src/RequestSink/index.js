import flyd from 'flyd'
import assoc from 'ramda/src/assoc'
import deviceConnectionNotifier from './deviceConnectionNotifier'

/* import 'webrtc-adapter' */
/* const getUserMedia = constraints => window.navigator.mediaDevices.getUserMedia(constraints) */
/* const audioContext = new AudioContext() */

const providerCreators = {
  deviceConnectionNotifier
}

export default () => {
  const providers = Object.keys(providerCreators).reduce(
    (providers, name) => assoc(name, providerCreators[name](), providers),
    {}
  )

  const sink = flyd.stream()
  sink.map(request => providers[request.type](request))
  return sink
}

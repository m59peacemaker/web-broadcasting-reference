import { Stream, map } from 'wark'
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

  const sink = Stream()
  map (request => providers[request.type](request)) (sink)
  return sink
}

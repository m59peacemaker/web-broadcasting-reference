import noop from 'nop'
import stopMediaStream from './stop-media-stream'

const initInputType = type => window.navigator.mediaDevices.getUserMedia({ [type]: true })
  .then(stopMediaStream)
  .catch(noop)

// mic, camera, etc labels are empty strings on mobile devices until permission is granted
const initInputs = () => Promise.all([ 'audio', 'video' ].map(initInputType))

const collectMediaDevicesInfo = () => initInputs()
  .then(() => navigator.mediaDevices.enumerateDevices())

export default collectMediaDevicesInfo

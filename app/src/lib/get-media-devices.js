import noop from 'nop'

const stopStream = stream => stream.getTracks().forEach(track => track.stop())

const initInputType = type => window.navigator.mediaDevices.getUserMedia({ [type]: true })
  .then(stopStream)
  .catch(noop)

// mic, camera, etc labels are empty strings on mobile devices until permission is granted
const initInputs = () => Promise.all([ 'audio', 'video' ].map(initInputType))

const getMediaDevices = () => initInputs()
  .then(() => navigator.mediaDevices.enumerateDevices())

export default getMediaDevices

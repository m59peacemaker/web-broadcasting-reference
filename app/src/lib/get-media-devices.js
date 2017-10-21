import noop from 'nop'

const stopStream = stream => stream.getTracks().forEach(track => track.stop())

const MediaDevicesTemplate = () => ({
  inputs: { audio: [], video: [] },
  outputs: { audio: [] }
})

const initInputType = type => window.navigator.mediaDevices.getUserMedia({ [type]: true })
  .then(stopStream)
  .catch(noop)

// mic, camera, etc labels are empty strings on mobile devices until permission is granted
const initInputs = () => Promise.all([ 'audio', 'video' ].map(initInputType))

const getMediaDevices = async () => {
  await initInputs()
  return (await navigator.mediaDevices.enumerateDevices())
    .reduce((result, device) => {
      const [ kind, type, direction ] = device.kind.match(/(\w+)(input|output)/i)
      const directionGroup = `${direction}s`
      Object.assign(device, { type, direction, directionGroup })

      if (device.deviceId === 'default') {
        result[directionGroup][type].default = device
      }

      if (kind === 'videoinput') {
        const [ _, facing ] = device.label.match(/facing ([a-z]+)/) || []
        if (facing) {
          device.facing = facing
          result.inputs.video[facing] = device
        }
      }

      result[directionGroup][type].push(device)
      return result
    }, MediaDevicesTemplate())
}


export default getMediaDevices

export {
  MediaDevicesTemplate
}

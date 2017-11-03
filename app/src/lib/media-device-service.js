import Emitter from 'better-emitter'

// TODO: getMediaDevices is essentially part of this service, maybe make a package of this

let devices = undefined

const service = Emitter()

const emitDevices = devices => {
  service.emit('devices', devices)
  service.emit('inputs', devices.inputs)
  service.emit('outputs', devices.outputs)
  service.emit('videoinputs', devices.inputs.video)
  service.emit('audioinputs', devices.inputs.audio)
  service.emit('audiooutputs', devices.outputs.audio)
}

const update = async () => {
  devices = await getMediaDevices()
  emitDevices(devices)
}

//window.navigator.mediaDevices.addEventListener('devicechange', update)
//update()

// TODO: API problems - what if this were called before update() has happened?
const getDevicesList = () => [
  ...devices.inputs.video,
  ...devices.inputs.audio,
  ...devices.outputs.audio
]

const getDevice = deviceId => getDevicesList().find(device => device.deviceId === deviceId)

const deviceIsConnected = deviceId => getDevice(deviceId) !== undefined

Object.assign(service, { getDevicesList, getDevice, deviceIsConnected })

export default service

import Device from '../schema/Device'
import makeMediaDeviceIntoNormalObject from './make-media-device-into-normal-object'

export default device => Object.assign(
  Device(device.kind),
  makeMediaDeviceIntoNormalObject(device)
)

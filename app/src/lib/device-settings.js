import mediaDeviceService from './media-device-service'
import omit from 'ramda/src/omit'

const Store = ({ id }) => {
  const getAll = () => JSON.parse(localStorage.getItem(id) || '{}')
  const get = key => getAll()[key]
  const set = (newData) => {
    const updatedData = Object.assign(getAll(), newData)
    localStorage.setItem(id, JSON.stringify(updatedData))
  }
  const clear = () => localStorage.removeItem(id)
  return { set, get, getAll, clear }
}

const store = Store({ id: 'media-device-settings' })

mediaDeviceService.on('devices', () => mediaDeviceService.getDevicesList()
  .forEach(device => {
    const { deviceId, kind } = device
    const storedSettings = store.get(deviceId)
    if (!storedSettings) {
      store.set({ [deviceId]: initialSettings[kind] })
    }
  })
)

const get = deviceId => store.get(deviceId)
const getAll = store.getAll
const set = (settings) => {
  const deviceIds = Object.keys(settings)
  deviceIds.forEach(deviceId => {
    const device = mediaDeviceService.getDevice(deviceId)
    const allowedKeys = initialSettings[device.kind]
    const unknownKeys = omit(allowedKeys, settings)

    if (unknownKeys.length) {
      throw new Error(`${unknownKeys} are not device settings`)
    }
  })

  store.set(settings)
}

export default { get, getAll, set }

export {
  audioProcessingModeConfigs
}

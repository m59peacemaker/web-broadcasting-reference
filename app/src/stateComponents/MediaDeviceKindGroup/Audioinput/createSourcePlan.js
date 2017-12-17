export default ({ model, destroy }) => {
  return {
    actions: {
      destroy,

      registerDevice: mediaDeviceInfo => {
        const isValidInfo = mediaDeviceInfo && typeof mediaDeviceInfo === 'object'
        if (!isValidInfo) {
          return new Error('device registration requires an object of media device info')
        }

        const { kind, label, deviceId } = mediaDeviceInfo

        if (model.devices.get()[deviceId]) {
          return new Error(`${kind} ${label} is already registered`)
        }

        return mediaDeviceInfo
      },

      unregisterDevice: mediaDeviceInfo => {
        const { kind, label, deviceId } = mediaDeviceInfo

        if (!model.devices.get()[deviceId]) {
          throw new Error(`${kind} ${label} is not registered`)
        }

        return mediaDeviceInfo
      }
    },

    messages: {
      deviceConnection: null
    }
  }
}

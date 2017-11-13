const MediaDevicesActions = (model$, components) => {
  const notifyOfDeviceConnect = deviceInfo =>
    components[deviceInfo.kind].actions.notifyOfDeviceConnect(deviceInfo)

  const notifyOfDeviceDisconnect = deviceInfo =>
    components[deviceInfo.kind].actions.notifyOfDeviceDisconnect(deviceInfo)

  return {
    notifyOfDeviceConnect,
    notifyOfDeviceDisconnect
  }
}

export {
  MediaDevicesActions
}

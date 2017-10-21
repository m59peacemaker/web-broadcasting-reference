const findDefaultDevice = devices => devices.find(d => d.deviceId === 'default') || devices[0]

export default findDefaultDevice

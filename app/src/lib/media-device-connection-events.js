import Emitter from 'better-emitter'
import addEventListener from 'addeventlistener'
import PQueue from 'p-queue'
import differenceWith from 'ramda/src/differenceWith'
import objForEach from 'ramda/src/forEachObjIndexed'
import flip from 'ramda/src/flip'
import collectMediaDevicesInfo from './collect-media-devices-info'

const isSameDevice = (a, b) => a.kind === b.kind && a.deviceId === b.deviceId

const determineConnectionChanges = (oldList, newList) => ({
  connected: differenceWith(isSameDevice, newList, oldList),
  disconnected: differenceWith(isSameDevice, oldList, newList)
})

const MediaDeviceConnectionEvents = () => {
  const infoCollectionQueue = new PQueue({concurrency: 1})
  const emitter = Emitter()
  let currentList = []

  const emitChanges = (changeType, devices) => devices.forEach(
    device => emitter.emit(changeType, device)
  )

  const refresh = () => infoCollectionQueue.add(collectMediaDevicesInfo)
    .then(newList => {
      objForEach(
        flip(emitChanges),
        determineConnectionChanges(currentList, newList)
      )
      currentList = newList
    })
    .catch(err => emitter.emit('error', err))

  const stopListening = addEventListener(
    window.navigator.mediaDevices,
    'devicechange',
    refresh
  )

  refresh()

  return emitter
}

export default MediaDeviceConnectionEvents

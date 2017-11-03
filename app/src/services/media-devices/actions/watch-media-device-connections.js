import flyd from 'flyd'
import dropRepeats from 'flyd/module/droprepeats'
const { dropRepeatsWith } = dropRepeats
import addEventListener from 'addeventlistener'
import getMediaDevices from '../../../lib/get-media-devices'
const jsonEqual = (a, b) => JSON.stringify(a) === JSON.stringify(b)

const watchMediaDeviceConnections = update$ => {
  const deviceChanges$ = flyd.stream()

  const stopListening = addEventListener(
    window.navigator.mediaDevices,
    'devicechange',
    deviceChanges$
  )

  const devices$ = flyd.map(getMediaDevices, deviceChanges$)

  /* unplugging a usb that has multiple devices will trigger multiple events,
   * but the updated devices info may be the same after checking per each event
   */
  flyd.on(console.log, devices$)
  //const devicesWithoutRepeats$ = dropRepeatsWith(jsonEqual, devices$)
  //flyd.on(devices => update$(() => devices), devicesWithoutRepeats$)
  //flyd.on(stopListening, update$.end)

  deviceChanges$({}) // initialize
}

export default watchMediaDeviceConnections

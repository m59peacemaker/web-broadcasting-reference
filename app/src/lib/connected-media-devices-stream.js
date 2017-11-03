import flyd from 'flyd'
import dropRepeats from 'flyd/module/droprepeats'
const { dropRepeatsWith } = dropRepeats
import addEventListener from 'addeventlistener'
import getMediaDevices from './get-media-devices'
const jsonEqual = (a, b) => JSON.stringify(a) === JSON.stringify(b)

const ConnectedMediaDevicesStream = () => {
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
  const devicesWithoutRepeats$ = dropRepeatsWith(jsonEqual, devices$)
  flyd.on(stopListening, devicesWithoutRepeats$.end)

  deviceChanges$({}) // initialize

  return devicesWithoutRepeats$
}

export default ConnectedMediaDevicesStream

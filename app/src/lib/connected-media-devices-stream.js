import flyd from 'flyd'
import { dropRepeatsWith } from 'flyd-droprepeats'
import addEventListener from 'addeventlistener'
import collectMediaDevicesInfo from './collect-media-devices-info'
const jsonEqual = (a, b) => JSON.stringify(a) === JSON.stringify(b)

const ConnectedMediaDevicesStream = () => {
  const deviceChanges$ = flyd.stream({})

  const stopListening = addEventListener(
    window.navigator.mediaDevices,
    'devicechange',
    deviceChanges$
  )

  const devices$ = flyd.map(collectMediaDevicesInfo, deviceChanges$)
  devices$([])

  /* unplugging a usb that has multiple devices will trigger multiple events,
   * but the updated devices info may be the same after checking per each event
   */
  const devicesWithoutRepeats$ = dropRepeatsWith(jsonEqual, devices$)
  flyd.on(stopListening, devicesWithoutRepeats$.end)

  return devicesWithoutRepeats$
}

export default ConnectedMediaDevicesStream

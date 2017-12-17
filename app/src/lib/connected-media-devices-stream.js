import * as W from 'wark'
import addEventListener from 'addeventlistener'
import collectMediaDevicesInfo from './collect-media-devices-info'
const jsonEqual = (a, b) => JSON.stringify(a) === JSON.stringify(b)

const ConnectedMediaDevicesStream = () => {
  const deviceChanges$ = W.Stream({})

  const stopListening = addEventListener(
    window.navigator.mediaDevices,
    'devicechange',
    deviceChanges$.set
  )

  const devices$ = W.map (collectMediaDevicesInfo) (deviceChanges$)
  devices$.set([])

  /* unplugging a usb that has multiple devices will trigger multiple events,
   * but the updated devices info may be the same after checking per each event
   */
  const devicesWithoutRepeats$ = W.skipRepeatsWith (jsonEqual) (devices$)

  W.map (stopListening) (devicesWithoutRepeats$.end)

  return devicesWithoutRepeats$
}

export default ConnectedMediaDevicesStream

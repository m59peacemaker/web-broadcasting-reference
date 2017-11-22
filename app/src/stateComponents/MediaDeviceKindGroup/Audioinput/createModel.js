import flyd from 'flyd'
import scanMerge from 'flyd/module/scanmerge'
import filter from 'flyd/module/filter'
import filterSplit from '../../../lib/flyd-filterSplit'
import both from 'ramda/src/both'
import compose from 'ramda/src/compose'
import not from 'ramda/src/not'
import atPath from 'ramda/src/path'
import assoc from 'ramda/src/assoc'
import dissoc from 'ramda/src/dissoc'
import { MediaDevice } from '../../MediaDevice'

const deviceIsAvailable = both(
  atPath([ 'state', 'connected' ]),
  compose(not, atPath([ 'state', 'active' ]))
)

export default ({ sources, sink }) => {
  const { actions, messages } = sources

  const deviceSources = flyd.merge(actions.registerDevice, messages.deviceConnection)

  const devices = scanMerge([
    [
      deviceSources,
      (devices, mediaDeviceInfo) => devices[mediaDeviceInfo.deviceId]
        ? devices
        : assoc(mediaDeviceInfo.deviceId, MediaDevice({ mediaDeviceInfo, sink }), devices)
    ],
    [
      actions.unregisterDevice,
      (devices, device) => {
        devices[device.deviceId].sources.actions.deactivate()
        return dissoc(device.deviceId, devices)
      }
    ]
  ], {})

  const devicesArray = devices.map(devices => Object.values(devices))

  const [ connected, disconnected ] = filterSplit(atPath([ 'state', 'connected' ]), devicesArray)

  const active = filter(atPath([ 'state', 'active' ]), devicesArray)

  const available = filter(deviceIsAvailable, devicesArray)

  const master = {} // MediaDeviceMaster(device.kind)

  return {
    master,
    devices,
    connected,
    disconnected,
    active,
    available
  }
}

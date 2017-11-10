import flyd from 'flyd'
import { dropRepeatsWith } from 'flyd-droprepeats'
import lensProp from 'ramda/src/lensProp'
import over from 'ramda/src/over'
import assoc from 'ramda/src/assoc'
import merge from 'ramda/src/merge'
import difference from 'ramda/src/difference'
import jsonEqual from '../../lib/json-equal'
import Model from './model'
import { KindSettings } from './schema/Settings'

const makeDefaultSettings = (kind, deviceIds) => deviceIds.reduce(
  (settings, deviceId) => assoc(deviceId, KindSettings[kind](), settings),
  {}
)

const Settings$ = ({ initialValue, connectedDevices$  }) => {
  const settings$ = flyd.stream(initialValue || Model())

  flyd.on(allDevices => {
    const allSettings = settings$()
    const updatedSettings = Object
      .keys(allDevices)
      .reduce(
        (allSettings, kind) => {
          const kindDevices = allDevices[kind]
          return over(lensProp(kind), kindSettings => {
            const newDeviceIds = difference(Object.keys(kindDevices), Object.keys(kindSettings))
            const newSettings = makeDefaultSettings(kind, newDeviceIds)
            return merge(kindSettings, newSettings)
          }, allSettings)
        },
        allSettings
      )
    settings$(updatedSettings)
  }, connectedDevices$)

  // settings$ is recalculated when devices are connected/disconnected, but the result is only different if a device has been connected that has not been connected before.
  return dropRepeatsWith(jsonEqual, settings$)
}

export default Settings$

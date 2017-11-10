import pipe from 'ramda/src/pipe'
import reduceBy from 'ramda/src/reduceBy'
import append from 'ramda/src/append'
import lensProp from 'ramda/src/lensProp'
import over from 'ramda/src/over'
import prop from 'ramda/src/prop'
import assocPath from 'ramda/src/assocPath'
import mergeDeep from 'deepmerge'
import KindGroups from '../schema/KindGroups'

const groupDevices = pipe(
  reduceBy(
    (group, device) => pipe(
      over(lensProp('inactive'), append(device.deviceId)),
      assocPath([ 'devices', device.deviceId ], device)
    )(group),
    {},
    prop('kind')
  ),
  v => mergeDeep(KindGroups(), v)
)

export default groupDevices

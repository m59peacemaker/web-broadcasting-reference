import pipe from 'ramda/src/pipe'
import over from 'ramda/src/over'
import lensProp from 'ramda/src/lensProp'
import omit from 'ramda/src/omit'
import mergeDeep from 'deepmerge'
import { MediaDeviceModel } from '../MediaDevice'

const MediaDeviceMasterModel = () => pipe(
  model => mergeDeep(MediaDeviceModel(), model),
  omit([ 'deviceId', 'groupId' ]),
  over(lensProp('state'), omit([ 'connected', 'active', 'activating', 'error' ]))
)({
  master: true, // marker so things can check whether it is master i.e. `if (input.master)`
  label: 'Master'
})

export {
  MediaDeviceMasterModel
}

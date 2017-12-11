import flyd from 'flyd'
import flydObj from 'flyd/module/obj'
import flatMap from 'flyd/module/flatmap'
import scanMerge from 'flyd/module/scanmerge'
import pipe from 'ramda/src/pipe'
import map from 'ramda/src/map'
import filter from 'ramda/src/filter'
import reduce from 'ramda/src/reduce'
import append from 'ramda/src/append'
import both from 'ramda/src/both'
import compose from 'ramda/src/compose'
import not from 'ramda/src/not'
import atPath from 'ramda/src/path'
import prop from 'ramda/src/prop'
import assoc from 'ramda/src/assoc'
import dissoc from 'ramda/src/dissoc'
import switchImmediate from '../../../lib/flyd-switchImmediate'
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
        if (devices[device.deviceId].model.state.active()) {
          devices[device.deviceId].sources.actions.deactivate()
        }
        return dissoc(device.deviceId, devices)
      }
    ]
  ], {})

  const deviceModels = devices.map(
    pipe(Object.values, map(prop('model')))
  )

  /* anytime deviceModels changes (a device was registered or unregistered),
      update which streams are being depended upon
  */
  /*const computed = flyd.map(
    models => // array of models, create a stream from it
      pipe(
        map(model => model.state.connected)

      ),
    deviceModels
  )*/

  /*const disconnected = flatMap(models => {
    const streams = map(atPath([ 'state', 'connected' ]), models)
    const new$ = flyd.combine(
      () => pipe(
        filter(v => !v.state.connected()),
        map(prop('deviceId'))
      )(models),
      streams
    )
    new$([])
    return new$
  }, deviceModels)
   */

  /* have stream of trees of streams,
    need stream computed from selected streams from those trees
      map over a stream to get a new stream, switch immediately to it
      that map fn needs to:
        choose dependencies from a tree
        emit the tree when those deps change
    then finally, map over those trees to compute the result you're after (like "connected ids")
   */

  /* currently mapping from the set of devices, but actually need to be mapping from the state of the known devices :/ This can never be helpful. Dead wrong logic. When registering / unregistering devices, needs to hook them up to a stream of their states so it can be computed from as any state changes */
  //const keepIdsWhere = pred => pipe(filter(pred), map(prop('deviceId')))

  //const connected = deviceModels.map(keepIdsWhere(atPath([ 'state', 'connected' ])))
  //const disconnected = deviceModels.map(keepIdsWhere(compose(not, atPath([ 'state', 'connected' ]))))

  //const active = deviceModels.map(keepIdsWhere(atPath([ 'state', 'active' ])))

  //const available = connected.map(filter(id => compose(not, atPath([ 'state', 'active' ]))))

  //const master = {} // MediaDeviceMaster(device.kind)

  return {
    //master,
    devices,
    //connected,
    //disconnected,
    //active,
    //available
  }
}

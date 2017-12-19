import * as W from 'wark'
import * as RA from 'ramda-adjunct'
import * as R from 'ramda'
import { MediaDevice } from '../../MediaDevice'

const deviceIsAvailable = R.both(
  R.path([ 'state', 'connected' ]),
  R.compose(R.not, R.path([ 'state', 'active' ]))
)

export default ({ sources, sink }) => {
  const { actions, messages } = sources

  const deviceSources = W.merge([ actions.registerDevice, messages.deviceConnection ])

  const devices = W.scanMerge
    ([
      [
        deviceSources,
        devices => mediaDeviceInfo => devices[mediaDeviceInfo.deviceId]
          ? devices
          : R.assoc(mediaDeviceInfo.deviceId, MediaDevice({ mediaDeviceInfo, sink }), devices)
      ],
      [
        actions.unregisterDevice,
        devices => device => {
          if (devices[device.deviceId].model.state.active.get()) {
            devices[device.deviceId].sources.actions.deactivate()
          }
          return R.dissoc(device.deviceId, devices)
        }
      ]
    ])
    ({})
  /* have: stream that emits an object wherein each value is a deep object wherein various values are streams
     need: streams computed from some streams from each deep object
  */

  const deviceModels = W.map
    (R.pipe (Object.values, R.map(R.prop('model'))))
    (devices)

  /* const [ connected, disconnected ] = R.pipe */
  /*   ( */
  /*     // make a stream that gets a value and emits a new stream */
  /*     W.map */
  /*       (R.pipe ( */
  /*         R.map // map over the array of things and return a new stream */
  /*           (R.pipe ( */
  /*             RA.flattenProp('state'), // just some data prep so we don't have to `pick` from nested */
  /*             R.pick([ 'deviceId', 'connected' ]), // { deviceId: String, connected: Stream } */
  /*             // new stream that emits { deviceId: String, connected: Boolean } when `connected` emits */
  /*             W.combineCollection */
  /*           )), */
  /*         /1* now array of things is array of streams */
  /*           make it into one stream that emits [ { deviceId, connected }. etc ] */
  /*             when any of the streams in the array change */
  /*         *1/ */
  /*         W.combineCollection */
  /*       )), */
  /*     W.switchImmediate, // have the value of / emit with the inner stream (unnest it) */
  /*     // connected: true in left array, connected: false in right array */
  /*     // keep just the device ids */
  /*     W.map (R.pipe(R.partition(R.prop('connected')), R.map(R.map(R.prop('deviceId'))))), */
  /*     // make an array of streams where the left stream emits the left array emitted by the above stream, and same for the right stream / array */
  /*     W.partitionArray (2) */
  /*   ) */
  /*   (deviceModels) // emits an array of things */

  const makeConnectedStateStream = R.pipe (
    RA.flattenProp('state'),
    R.pick([ 'deviceId', 'connected' ]),
    W.combineCollection
  )

  const makeStreamOfConnectedStates = R.pipe (R.map(makeConnectedStateStream), W.combineCollection)

  /* TODO: I suspect this kind of thing could be much better expressed by separating the stream combining from the data transformation
    map emits with the source with the source value
    switch switches to the stream from the source value and uses its value
    tap passes a value through unchanged
    identity returns the value given to it unchanged
    W.switchIdentity
    W.emitSwitch
    W.identityOn
    W.switchBy
      // valueFromSource => streamToEmitOn
      (sourceValue => sourceValue.state.connected)
      // valueFromSource => valueFromStreamToEmitOn => valueToEmit
      (sourceValue => innerValue => innerValue)
      (source)
    W.mapEmit? W.emitFrom?
    W.switchTap?
    W.emitBy (fnThatTakesCurrentValueAndReturnsStreamToEmitOn) (source)
    W.emitBy (R.path([ 'state', 'connected' ])) (source)
  */
  const [ connected, disconnected ] = R.pipe
    (
      W.map (makeStreamOfConnectedStates),
      W.switchImmediate,
      W.map (R.pipe(R.partition(R.prop('connected')), R.map(R.map(R.prop('deviceId'))))),
      W.partitionArray (2)
    )
    (deviceModels)

  const [ active, inactive ] = R.pipe
    (
      W.map
        (R.pipe (
          R.map
            (R.pipe (
              RA.flattenProp('state'),
              R.pick([ 'deviceId', 'active' ]),
              W.combineCollection
            )),
          W.combineCollection
        )),
      W.switchImmediate,
      W.map (R.pipe(R.partition(R.prop('active')), R.map(R.map(R.prop('deviceId'))))),
      W.partitionArray (2)
    )
    (deviceModels)

  const activating = R.pipe
    (
      W.map
        (R.pipe (
          R.map
            (R.pipe (
              RA.flattenProp('state'),
              R.pick([ 'deviceId', 'activating' ]),
              W.combineCollection
            )),
          W.combineCollection
        )),
      W.switchImmediate,
      W.map (R.pipe(R.filter(R.prop('activating')), R.map(R.prop('deviceId'))))
    )
    (deviceModels)

  //const master = {} // MediaDeviceMaster(device.kind)
  const lift = fn => sources => W.combine
    ((sources, self) => self.set(fn(...sources.map(s => s.get()))))
    (sources)

  const available = lift
    (R.without)
    ([
      lift (R.concat) ([ active, activating ]),
      connected
    ])

  return {
    //master,
    devices,
    connected,
    disconnected,
    active,
    activating,
    inactive,
    available
  }
}

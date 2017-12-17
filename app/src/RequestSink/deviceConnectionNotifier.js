import { Stream, endsOn, map, filter } from 'wark'
import pipe from 'ramda/src/pipe'
import jsonEqual from '../lib/json-equal'
import MediaDeviceConnectionEvents from '../lib/media-device-connection-events'

export default () => {
  const connectionChange$ = Stream()
  const deviceConnectionEvents = MediaDeviceConnectionEvents()

  const unsubscribe = pipe(
    deviceConnectionEvents.on(
      'connected',
      device => connectionChange$({ type: 'connection', device })
    ),
    deviceConnectionEvents.on(
      'disconnected',
      device => connectionChange$({ type: 'disconnection', device })
    ),
    // TODO: do something with these errors
    deviceConnectionEvents.on('error', console.log)
  )

  const cancel = () => {
    connection$.end()
    disconnection$.end()
    unsubscribe()
  }

  const onRequest = request => {
    const mustMatch = [ 'kind', 'deviceId' ].filter(key => request[key])

    pipe
      (
        filter
          (device => jsonEqual(
            pick(mustMatch, device), pick(mustMatch, request)
          )),
        map (({ type, device }) => request[`${type}$`](device)),
        endsOn ([ request.connection$.end ])
      )
      (connectionChange$)
  }

  return { onRequest, cancel }
}

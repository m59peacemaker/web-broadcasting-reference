import flyd from 'flyd'
import noop from 'nop'
import pipe from 'ramda/src/pipe'

const applyEffects = (requests, sink = noop) => {
  const cancel = Object.keys(requests)
    .reduce((cancel, requestType) => {
      const request$ = requests[requestType]
      if (!flyd.isStream(request$)) {
        throw new Error(`Effect request "${requestType}" is not a flyd stream. Got ${typeof request$}."`)
      }

      const listener = flyd.on(
        request => sink({ type: requestType, request }),
        request$
      )
      return pipe(cancel, () => listener.end(true))
    }, noop)

  return { cancel }
}

export default applyEffects

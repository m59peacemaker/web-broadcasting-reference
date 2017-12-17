import * as W from 'wark'
import noop from 'nop'
import pipe from 'ramda/src/pipe'

const applyEffects = (requests, sink = noop) => {
  const cancel = Object.keys(requests)
    .reduce((cancel, requestType) => {
      const request$ = requests[requestType]
      if (!W.isStream(request$)) {
        throw new Error(`Effect request "${requestType}" is not a wark stream. Got ${typeof request$}."`)
      }

      const listener = W.map
        (request => sink({ type: requestType, request }))
        (request$)
      return pipe(cancel, listener.end)
    }, noop)

  return { cancel }
}

export default applyEffects

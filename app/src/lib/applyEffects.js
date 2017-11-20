import noop from 'nop'
import flyd from 'flyd'
import pipe from 'ramda/src/pipe'

const applyEffects = (requests, mediator) => {
  const cancel = Object.keys(requests)
    .reduce((cancel, requestName) => {
      const request$ = requests[requestName]
      if (!flyd.isStream(request$)) {
        throw new Error(`Effect request "${requestName}" is not a flyd stream. Got ${typeof request$}."`)
      }
      const handler = request => mediator ? mediator.call(requestName, request) : noop
      const listener = flyd.on(handler, request$)
      return pipe(cancel, () => listener.end(true))
    }, noop)

  return { cancel }
}

export default applyEffects

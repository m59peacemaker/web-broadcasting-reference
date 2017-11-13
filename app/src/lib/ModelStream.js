import flyd from 'flyd'
import flydObj from 'flyd/module/obj'
import { over } from './model-helpers'

const Model$ = (initialState, { dynamicChildren = [] } = {}) => {
  const model$ = flydObj.stream(initialState)
  const update = mapFn => model$(mapFn(model$()))
  const subscribe = listener => {
    const end$ = flyd.on(listener, model$)
    return { cancel: () => end$(true) }
  }
  return Object.assign(model$, { update, subscribe })
}

export default Model$

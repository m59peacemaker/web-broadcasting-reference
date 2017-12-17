import * as W from 'wark'

const assignStreamHelpers = stream$ => {
  const update = mapFn => stream$.set(mapFn(stream$.get()))
  const subscribe = listener => {
    const end$ = W.map (listener) (stream$)
    return { cancel: end$ }
  }
  return Object.assign(stream$, { update, subscribe })
}

export default assignStreamHelpers

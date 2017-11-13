import flyd from 'flyd'

const assignStreamHelpers = stream$ => {
  const update = mapFn => stream$(mapFn(stream$()))
  const subscribe = listener => {
    const end$ = flyd.on(listener, stream$)
    return { cancel: () => end$(true) }
  }
  return Object.assign(stream$, { update, subscribe })
}

export default assignStreamHelpers

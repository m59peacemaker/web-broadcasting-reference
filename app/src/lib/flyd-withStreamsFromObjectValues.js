import flyd from 'flyd'
import map from 'ramda/src/map'

/* everytime source$ emits
    - end previous dynamic child stream
    - make a single stream out of values of source$()
    - whenever that stream emits
      - get source value
      - extract its dynamic children
      - update new$ with result
    - get source value
    - extract its dynamic children
    - update new$ with result
*/

// $source should emit object or arrays whose values are streams
const withStreamsFromObjectValues = source$ => {
  const push = new$ => new$(
    map(v => v(), source$())
  )

  let child$ = flyd.stream()
  const new$ = flyd.combine((source$, self$) => {
    child$.end(true)
    child$ = flyd.combine(
      () => push(self$),
      Object.values(source$())
      // to make it support objects whose values are not all streams:
      // values(state).filter(flyd.isStream)
    )

    push(self$)
  }, [ source$ ])

  // TODO: not sure if this cleanup code is sufficient
  flyd.on(() => child$.end(true), new$.end)

  return new$
}

export default withStreamsFromObjectValues

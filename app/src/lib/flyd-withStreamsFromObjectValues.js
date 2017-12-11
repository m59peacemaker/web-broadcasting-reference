import flyd from 'flyd'
import map from 'ramda/src/map'
import filter from 'ramda/src/filter'

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
      pipe(
        Object.values,
        filter(flyd.isStream)
      )(source$())
    )

    push(self$)
  }, [ source$ ])

  flyd.endsOn(new$.end, child$)

  return new$
}

export default withStreamsFromObjectValues

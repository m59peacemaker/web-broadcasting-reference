import flyd from 'flyd'
import Rpath from 'ramda/src/path'
import over from 'ramda/src/over'
import lensPath from 'ramda/src/lensPath'
import flip from 'ramda/src/flip'

const withStreamAtPath = (pathThatMightBeStreamSometime, source$) => {
  let endDependencyListen$ = flyd.stream().end

  const unwrapDiscoveredStream = (stream$, self$) => {
    endDependencyListen$ = flyd.on(streamValue => self$(
      assocPath(pathThatMightBeStreamSometime, streamValue, self$())
    ), stream$)
  }

  const new$ = flyd.combine((source$, self$) => {
    const state = source$()
    return over(
      lensPath(pathThatMightBeStreamSometime),
      valueAtPath => {
        endDependencyListen$(true)

        if (flyd.isStream(valueAtPath)) {
          unwrapDiscoveredStream(valueAtPath, self$)
          return valueAtPath()
        }

        return valueAtPath
      },
      state
    )
  }, [ source$ ])

  flyd.on(() => endDependencyListener$(true), new$.end)

  return new$
}

const withStreamAtPaths = (paths, source$) => paths.reduce(flip(withStreamAtPath), source$)

export default withStreamAtPath

export {
  withStreamAtPath,
  withStreamAtPaths
}

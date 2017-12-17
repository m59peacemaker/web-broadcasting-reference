import { Stream, isStream, combine, map } from 'wark'
import Rpath from 'ramda/src/path'
import over from 'ramda/src/over'
import lensPath from 'ramda/src/lensPath'
import flip from 'ramda/src/flip'

const withStreamAtPath = (pathThatMightBeStreamSometime, source) => {
  let endDependencyListen = Stream().end

  const unwrapDiscoveredStream = (stream, self) => {
    endDependencyListen = map
      (streamValue =>
        self.set(
          assocPath(pathThatMightBeStreamSometime, streamValue, self.get())
        )
      )
      (stream)
  }

  const new$ = combine
    (([ source ], self) => {
      const state = source.get()
      return over(
        lensPath(pathThatMightBeStreamSometime),
        valueAtPath => {
          endDependencyListen()

          if (isStream(valueAtPath)) {
            unwrapDiscoveredStream(valueAtPath, self)
            return valueAtPath()
          }

          return valueAtPath
        },
        state
      )
    })
    ([ source ])

  map (() => endDependencyListen(), new$.end)

  return new$
}

const withStreamAtPaths = (paths, source) => paths.reduce(flip(withStreamAtPath), source)

export default withStreamAtPath

export {
  withStreamAtPath,
  withStreamAtPaths
}

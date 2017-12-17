import { Stream, map, merge, partition } from 'wark'
import pipe from 'ramda/src/pipe'

const isObj = value => value != undefined && typeof value === 'object'
const isError = v => v instanceof Error

const applySanitizer = (sanitizer, source) => {
  const [ sourceRejection, sanitizedSource ] = partition
    (isError)
    (map (sanitizer) (source))
  return { sanitizedSource, sourceRejection }
}

const createSource = value => {
  const source = Stream()

  const { sanitizedSource, sourceRejection } = typeof value === 'function'
    ? applySanitizer(value, source)
    : { sanitizedSource: source }

  const cancel = source.end

  return { source, sanitizedSource, sourceRejection, cancel }
}

const createSources = sourcePlan => {
  const anySourceRejection = Stream()

  return Object
    .keys(sourcePlan)
    .reduce(
      (result, key) => {
        const value = sourcePlan[key]

        if (isObj(value)) {
          const {
            sources, sanitizedSources, sourceRejections, anySourceRejection, cancel
          } = createSources(value)

          result.sources[key] = sources
          result.sanitizedSources[key] = sanitizedSources
          result.cancel = pipe(cancel, result.cancel)
          if (Object.values(sourceRejections).length) {
            result.sourceRejections[key] = sourceRejections
            result.anySourceRejection = merge([ anySourceRejection, result.anySourceRejection ])
          }
        } else {
          const { source, sanitizedSource, sourceRejection, cancel } = createSource(value)

          result.sources[key] = source
          result.sanitizedSources[key] = sanitizedSource
          result.cancel = pipe(cancel, result.cancel)
          if (sourceRejection) {
            result.sourceRejections[key] = sourceRejection
            result.anySourceRejection = merge([ sourceRejection, result.anySourceRejection ])
          }
        }

        return result
      },
      {
        sources: { },
        sanitizedSources: { },
        sourceRejections: { },
        anySourceRejection,
        cancel: anySourceRejection.end
      }
    )
}

export default createSources

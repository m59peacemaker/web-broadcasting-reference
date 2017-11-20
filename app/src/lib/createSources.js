import flyd from 'flyd'
import filterSplit from './flyd-filterSplit'
import pipe from 'ramda/src/pipe'

const isObj = value => value != undefined && typeof value === 'object'
const isError = v => v instanceof Error

const applySanitizer = (sanitizer, source) => {
  const [ sourceRejection, sanitizedSource ] = filterSplit(isError, source.map(sanitizer))
  return { sanitizedSource, sourceRejection }
}

const createSource = value => {
  const source = flyd.stream()

  const { sanitizedSource, sourceRejection } = typeof value === 'function'
    ? applySanitizer(value, source)
    : { sanitizedSource: source }

  const cancel = () => source.end(true)

  return { source, sanitizedSource, sourceRejection, cancel }
}

const createSources = sourcePlan => {
  const anySourceRejection = flyd.stream()

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
            result.anySourceRejection = flyd.merge(anySourceRejection, result.anySourceRejection)
          }
        } else {
          const { source, sanitizedSource, sourceRejection, cancel } = createSource(value)

          result.sources[key] = source
          result.sanitizedSources[key] = sanitizedSource
          result.cancel = pipe(cancel, result.cancel)
          if (sourceRejection) {
            result.sourceRejections[key] = sourceRejection
            result.anySourceRejection = flyd.merge(sourceRejection, result.anySourceRejection)
          }
        }

        return result
      },
      {
        sources: { },
        sanitizedSources: { },
        sourceRejections: { },
        anySourceRejection,
        cancel: () => anySourceRejection.end(true)
      }
    )
}

export default createSources

import flyd from 'flyd'
import filterSplit from './flyd-filterSplit'

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

  return { source, sanitizedSource, sourceRejection }
}

const createSources = sourcePlan => Object
  .keys(sourcePlan)
  .reduce(
    (result, key) => {
      const value = sourcePlan[key]

      if (isObj(value)) {
        const {
          sources, sanitizedSources, sourceRejections, anySourceRejection
        } = createSources(value)

        result.sources[key] = sources
        result.sanitizedSources[key] = sanitizedSources
        if (Object.values(sourceRejections).length) {
          result.sourceRejections[key] = sourceRejections
          result.anySourceRejection = flyd.merge(anySourceRejection, result.anySourceRejection)
        }
      } else {
        const { source, sanitizedSource, sourceRejection } = createSource(value)

        result.sources[key] = source
        result.sanitizedSources[key] = sanitizedSource
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
      anySourceRejection: flyd.stream()
    }
  )

export default createSources

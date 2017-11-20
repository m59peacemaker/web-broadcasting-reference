import flyd from 'flyd'
import noop from 'nop'
import createSources from './createSources'
import applyEffects from './applyEffects'

const requiredArgumentNames = [ 'createSourcePlan', 'createModel', 'createEffectRequests' ]
const assertHasRequiredArguments = (args) => {
  requiredArgumentNames.forEach(argumentName => {
    const argument = args[argumentName]
    if (!argument) {
      throw new Error(`argument "${argumentName}" is required`)
    }
  })
}

const StateComponent = ({
  createSourcePlan,
  createModel,
  createEffectRequests,
  getSink = noop
}) => {

  assertHasRequiredArguments({ createSourcePlan, createModel, createEffectRequests })

  const model = {}
  const destroy = flyd.stream()

  const {
    sources,
    sanitizedSources,

    /* TODO: not sure what to do with source rejections
        source sanitizers probably should just be offering some type safety
        and making sure that the sources aren't called in certain situations
        or at certain times that don't make sense
        These would just be developer errors in the code interacting with the component,
        not the kind of thing where the state needs to be
        used as something the application itself actually cares about.
    */
    sourceRejections,
    anySourceRejection,

    cancel: cancelSources,
  } = createSources(createSourcePlan({ model, destroy }))

  Object.assign(model, createModel({ sources: sanitizedSources }))

  const requests = createEffectRequests({ model, sources: sanitizedSources })

  const sink = getSink({ model, sources })

  const effects = applyEffects(requests, sink)

  destroy.map(() => {
    effects.cancel()
    cancelSources()
    destroy.end(true)
  })

  return {
    sources,
    model,
    requests,
    sourceRejections,
    anySourceRejection
  }
}

export default StateComponent
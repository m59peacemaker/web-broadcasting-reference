import applyEffects from '../../../lib/applyEffects'
import createSources from './createSources'
import createModel from './createModel'
import createEffectRequests from './createEffectRequests'

// TODO: ramda orPath might be useful for setting initial state from the outside world
// init.map(orPath([ 'settings', processingMode ], defaults.settings.processingMode ]))

const Audioinput = ({ mediaDeviceInfo, mediator }) => {
  /* assigning to model is unfortunate :/
    but stuff that is created in `createSources()` will need to examine `model` later, at which time it will be populated. I think this like the cycle sink/source dependency problem, which it solves using a proxy stream */
  const model = {}

  const {
    sources,
    sanitizedSources,

    /* TODO: not sure what to do with source rejections */
    sourceRejections,
    anySourceRejection
  } = createSources({ model })

  Object.assign(model, createModel({ mediaDeviceInfo, sources: sanitizedSources }))

  const requests = createEffectRequests({ model, sources: sanitizedSources })

  const effects = applyEffects(requests, mediator)

  // TODO: make sure this destroy is complete and figure out the best place for it to go
  // TODO: how does stuff "subscribe" to destroy? or would anything actually need to?
  sources.actions.destroy.map(() => {
    sources.actions.deactivate(null)
    effects.cancel()

    // is this even necessary? maybe this stuff would get garbage collected.
    // deepForEach(model, value => flyd.isStream(value) && value.end(true))
  })

  return {
    sources,
    model,
    requests,
    sourceRejections,
    anySourceRejection
  }
}

export * from './InitialState'
export {
  Audioinput
}

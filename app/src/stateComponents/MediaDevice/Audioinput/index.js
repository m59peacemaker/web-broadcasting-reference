import StateComponent from '../../../lib/StateComponent'
import createSourcePlan from './createSourcePlan'
import createModel from './createModel'
import createEffectRequests from './createEffectRequests'

const Audioinput = ({ mediaDeviceInfo, sink }) => StateComponent({
  createSourcePlan,
  createModel: ({ sources }) => createModel({ sources, mediaDeviceInfo }),
  createEffectRequests,
  sink
})

export * from './InitialState'
export {
  Audioinput
}

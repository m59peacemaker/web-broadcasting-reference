import StateComponent from '../../../lib/StateComponent'
import createSourcePlan from './createSourcePlan'
import createModel from './createModel'
import createEffectRequests from './createEffectRequests'

const Audioinput = ({ mediaDeviceInfo, mediator }) => StateComponent({
  createSourcePlan,
  createModel: ({ sources }) => createModel({ sources, mediaDeviceInfo }),
  createEffectRequests,
  getSink: () => mediator
})

export * from './InitialState'
export {
  Audioinput
}

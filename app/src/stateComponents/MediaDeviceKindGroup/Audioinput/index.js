import StateComponent from '../../../lib/StateComponent'
import createSourcePlan from './createSourcePlan'
import createModel from './createModel'
import createEffectRequests from './createEffectRequests'

const AudioinputGroupInitialState = () => ({
  connected: [],
  disconnected: [],
  active: [],
  available: [],
  devices: [],
  master: {}
})

const AudioinputGroup = ({ sink } = {}) => StateComponent({
  createSourcePlan,
  createModel,
  createEffectRequests,
  sink
})

export {
  AudioinputGroup,
  AudioinputGroupInitialState
}

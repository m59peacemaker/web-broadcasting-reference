import omit from 'ramda/src/omit'
import { KindState } from './State'
import { KindSettings } from './Settings'

const Master = kind => ({
  master: true, // marker so things can check whether it is master i.e. `if (input.master)`
  kind,
  label: 'Master',
  state: omit([ 'connected', 'active' ], KindState(kind)),
  settings: KindSettings(kind)
})

export default Master

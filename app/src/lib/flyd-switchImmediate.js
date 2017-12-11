import flyd from 'flyd'
import switchLatest from 'flyd/module/switchlatest'

const switchImmediate = stream => flyd.merge(
  switchLatest(stream),
  flyd.map(v => v(), stream)
)

export default switchImmediate

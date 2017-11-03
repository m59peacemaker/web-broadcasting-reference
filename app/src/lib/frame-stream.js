import RafLoop from './raf-loop'
import flyd from 'flyd'

const FrameStream = () => {
  const stream = flyd.stream()
  const rafLoop = RafLoop(() => stream(1))
  flyd.on(rafLoop.cancel, stream.end)
  return stream
}

export default FrameStream

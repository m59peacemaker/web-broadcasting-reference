import * as W from 'wark'
import RafLoop from './raf-loop'

const FrameStream = () => {
  const stream = W.Stream(1)
  const rafLoop = RafLoop(() => stream.set(1))
  W.map (rafLoop.cancel) (stream.end)
  return stream
}

export default FrameStream

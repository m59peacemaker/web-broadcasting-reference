const raf = window.requestAnimationFrame
const RafLoop = fn => {
  let nextFrame

  const renderFrame = () => {
    nextFrame = raf(() => {
      fn()
      return renderFrame()
    })
  }

  const cancel = () => window.cancelAnimationFrame(nextFrame)

  renderFrame()

  return { cancel }
}

export default RafLoop

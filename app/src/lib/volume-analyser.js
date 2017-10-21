const getDynamicRange = buffer => {
  const { max, min } = buffer.reduce((acc, sample) => {
    if (sample < acc.min) {
      acc.min = sample
    } else if (sample > acc.max) { 
      acc.max = sample
    }
    return acc
  }, { min: 128, max: 128 })

  return (max - min) / 255
}

// higher fftSize is more accurate but less performant
const VolumeAnalyser = (audioContext, { fftSize = 2048, smoothingTimeConstant = 0 } = {}) => {
  const analyser = audioContext.createAnalyser()
  analyser.smoothingTimeConstant = smoothingTimeConstant
  analyser.fftSize = fftSize

  const data = new Uint8Array(analyser.frequencyBinCount)

  const getVolume = () => {
    analyser.getByteTimeDomainData(data)
    const range = getDynamicRange(data) * (Math.E - 1)
    return Math.log1p(range)
  }

  return { node: analyser, getVolume }
}

export default VolumeAnalyser

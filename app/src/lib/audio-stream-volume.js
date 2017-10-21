const getVolume = (analyser, fftBins) => {
  analyser.getFloatFrequencyData(fftBins)
  return fftBins
    .slice(4)
    .filter(v => v < 0)
    .reduce(
      (result, fftBin) => fftBin > result ? fftBin : result,
      -Infinity
    )
}


  var looper = function() {
    setTimeout(function() {

      //check if stop has been called
      if(!running) {
        return
      }

      var currentVolume = getMaxVolume(analyser, fftBins)

      harker.emit('volume_change', currentVolume, threshold)

      var history = 0
      if (currentVolume > threshold && !harker.speaking) {
        // trigger quickly, short history
        for (var i = harker.speakingHistory.length - 3 i < harker.speakingHistory.length i++) {
          history += harker.speakingHistory[i]
        }
        if (history >= 2) {
          harker.speaking = true
          harker.emit('speaking')
        }
      } else if (currentVolume < threshold && harker.speaking) {
        for (var i = 0 i < harker.speakingHistory.length i++) {
          history += harker.speakingHistory[i]
        }
        if (history == 0) {
          harker.speaking = false
          harker.emit('stopped_speaking')
        }
      }
      harker.speakingHistory.shift()
      harker.speakingHistory.push(0 + (currentVolume > threshold))

      looper()
    }, interval)
  }
  looper()


const AudioVolumeMeter = stream => {
  const audioContext = new audioContextType()
  const analyser = audioContext.createAnalyser()
  analyser.fftSize = 512
  analyser.smoothingTimeConstant = smoothing
  const fftBins = new Float32Array(analyser.frequencyBinCount)
}


export default AudioVolumeMeter

/*
  takes an audio context and a mediaTrack
  returns a new track and a [gain property](https://developer.mozilla.org/en-US/docs/Web/API/GainNode/gain) for controlling that track's gain
  the new track stops when its source track stops, since it is useless beyond that
*/

const GainTrack = (context, track) => {
  const gainNode = context.createGain()
  const src = context.createMediaStreamSource(new MediaStream([ track ]))
  const dest = context.createMediaStreamDestination()
  src.connect(gainNode)
  gainNode.connect(dest)
  const newTrack = dest.stream.getAudioTracks()[0]
  track.addEventListener('ended', () => {
    newTrack.stop()
    // I don't this matters, but just in case. I think gc takes care of it.
    src.disconnect(gainNode)
    gainNode.disconnect(dest)
  })
  return { track: newTrack, gain: gainNode.gain }
}

export default GainTrack

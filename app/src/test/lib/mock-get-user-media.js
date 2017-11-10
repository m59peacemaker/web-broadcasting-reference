const audioContext = new AudioContext()
const makeAudioTrack = () => audioContext
  .createMediaStreamDestination()
  .stream
  .getAudioTracks()
  [0]

const mockGetUserMedia = constraints => Promise.resolve().then(() => {
  if (constraints.video) {
    throw new Error(`this getUserMedia mock can't mock video video tracks`)
  }

  const stream = new MediaStream()
  const audioTrack = makeAudioTrack()
  //audioTrack.applyConstraints(constraints.audio || {}) // not supported yet
  stream.addTrack(audioTrack)

  return stream
})

export default mockGetUserMedia

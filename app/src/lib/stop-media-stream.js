export default stream =>
  stream.getTracks()
    .forEach(track => track.stop())

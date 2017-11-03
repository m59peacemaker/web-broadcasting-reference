const replaceTracks = (toStream, fromStream) => {
  ;[ 'Audio', 'Video' ].forEach(type => {
    const getTracks = stream => stream[`get${ type }Tracks`]()
    const newTracks = getTracks(fromStream)
    if (newTracks.length) {
      getTracks(toStream).forEach(track => {
        track.stop()
        toStream.removeTrack(track)
      })
      newTracks.forEach(track => toStream.addTrack(track))
    }
  })
}

export default replaceTracks

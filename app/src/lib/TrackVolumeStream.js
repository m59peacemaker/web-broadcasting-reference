import Frame$ from './frame-stream'
import TrackVolumeAnalyser from './track-volume-analyser'

const TrackVolume$ = (audioContext, track) => {
  const volumeAnalyser = TrackVolumeAnalyser(audioContext, track)
  return Frame$().map(volumeAnalyser.getVolume)
}

export default TrackVolume$

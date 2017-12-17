import Frame$ from './frame-stream'
import * as W from 'wark'
import TrackVolumeAnalyser from './track-volume-analyser'

const TrackVolume$ = (audioContext, track) => {
  const volumeAnalyser = TrackVolumeAnalyser(audioContext, track)
  const frames = Frame$()
  const volume = W.map (volumeAnalyser.getVolume) (frames)
  W.endsOn ([ volume.end ]) (frames)
  return volume
}

export default TrackVolume$

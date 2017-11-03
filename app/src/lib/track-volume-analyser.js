/* takes an audio context and a mediaTrack
  returns an object with a property `getVolume` you can call to get the volume of the track
  and a property `cancel` you can call to end it
  it will automatically clean itself up when/if the track ends
*/

import VolumeAnalyser from './volume-analyser'

const TrackVolumeAnalyser = (context, track) => {
  const { node, getVolume } = VolumeAnalyser(context)
  const src = context.createMediaStreamSource(new MediaStream([ track ]))
  const cancel = () => src.disconnect(node)
  track.addEventListener('ended', cancel)
  src.connect(node)
  return { getVolume, cancel }
}

export default TrackVolumeAnalyser

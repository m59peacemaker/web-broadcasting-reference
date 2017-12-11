import { MediaDeviceKindGroup } from '../MediaDeviceKindGroup'
import assoc from 'ramda/src/assoc'

const MediaDevices = ({ sink }) => {
  return [
    'audioinput'
  ].reduce(
    (groups, kind) => assoc(kind, MediaDeviceKindGroup({ kind }), groups),
    {}
  )
}

export default MediaDevices
export {
  MediaDevices
}

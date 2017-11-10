import Videoinput from './Videoinput'
import Audioinput from './Audioinput'
import Audiooutput from './Audiooutput'
import MediaDeviceModel from './Model'

const map = {
  videoinput: Videoinput,
  audioinput: Audioinput,
  audiooutput: Audiooutput
}

const MediaDevice = (mediaDeviceInfo, ...rest) =>
  map[mediaDeviceInfo.kind](mediaDeviceInfo, ...rest)

export {
  MediaDeviceModel,
  MediaDevice,
  Videoinput,
  Audioinput,
  Audiooutput,
}

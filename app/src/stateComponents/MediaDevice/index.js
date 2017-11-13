import { Videoinput } from './Videoinput'
import { Audioinput } from './Audioinput'
import { Audiooutput } from './Audiooutput'

const map = {
  videoinput: Videoinput,
  audioinput: Audioinput,
  audiooutput: Audiooutput
}

const MediaDevice = (mediaDeviceInfo, ...rest) =>
  map[mediaDeviceInfo.kind](mediaDeviceInfo, ...rest)

export * from './Device'
export * from './Videoinput'
export * from './Audioinput'
export * from './Audiooutput'
export {
  MediaDevice
}

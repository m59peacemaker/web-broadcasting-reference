import { VideoinputKindGroup } from './Videoinput'
import { AudioinputKindGroup } from './Audioinput'
import { AudiooutputKindGroup } from './Audiooutput'

const map = {
  videoinput: VideoinputKindGroup,
  audioinput: AudioinputKindGroup,
  audiooutput: AudiooutputKindGroup
}

const MediaDeviceKindGroup = (kind, ...args) => map[kind](...args)

export * from './KindGroup'
export * from './Videoinput'
export * from './Audioinput'
export * from './Audiooutput'
export {
  MediaDeviceKindGroup
}

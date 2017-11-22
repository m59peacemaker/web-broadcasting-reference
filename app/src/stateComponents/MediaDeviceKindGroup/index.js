import { AudioinputGroup } from './Audioinput'

const map = {
  audioinput: AudioinputGroup,
}

const MediaDeviceKindGroup = args => map[arg.kind](args)

export * from './Audioinput'
export {
  MediaDeviceKindGroup
}

import { AudioinputGroup } from './Audioinput'

const map = {
  audioinput: AudioinputGroup,
}

const MediaDeviceKindGroup = args => map[args.kind](args)

export * from './Audioinput'
export {
  MediaDeviceKindGroup
}

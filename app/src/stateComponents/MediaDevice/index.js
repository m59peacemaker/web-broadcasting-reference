import { Audioinput } from './Audioinput'

const map = {
  audioinput: Audioinput
}

const MediaDevice = args => map[args.mediaDeviceInfo.kind](args)

export * from './Audioinput'
export {
  MediaDevice
}

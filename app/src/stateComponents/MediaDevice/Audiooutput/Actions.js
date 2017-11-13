import { MediaDeviceActions } from '../Device'

const AudiooutputActions = (model$, { getUserMedia }) => {

  return Object.assign(MediaDeviceActions('audiooutput', model$), {

  })
}

export {
  AudiooutputActions
}

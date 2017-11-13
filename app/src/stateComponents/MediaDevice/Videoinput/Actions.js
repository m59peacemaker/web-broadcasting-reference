import { MediaDeviceActions } from '../Device'

const VideoinputActions = (model$, { getUserMedia }) => {

  return Object.assign(MediaDeviceActions('videoinput', model$), {

  })
}

export {
  VideoinputActions
}

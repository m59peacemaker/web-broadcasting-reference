import { set } from '../../../lib/model-helpers'

const MediaDeviceActions = (kind, model$) => {
  const setConnected = bool => model$.update(set([ 'state', 'connected' ], bool))
  const notifyOfConnect = () => setConnected(true)
  const notifyOfDisconnect = () => setConnected(false)

  return {
    notifyOfConnect,
    notifyOfDisconnect
  }
}

export {
  MediaDeviceActions
}

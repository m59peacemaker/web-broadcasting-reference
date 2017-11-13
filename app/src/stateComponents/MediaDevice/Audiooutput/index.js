import  makeMediaDeviceInfoIntoNormalObject from '../lib/make-media-device-into-normal-object'
import { AudiooutputModel } from './Model'
import { AudiooutputActions } from './Actions'
import Model$ from '../../../lib/ModelStream'

const Audiooutput = (mediaDeviceInfo, { getUserMedia }) => {
  const initialModel = Object.assign(
    AudiooutputModel(),
    makeMediaDeviceInfoIntoNormalObject(mediaDeviceInfo)
  )
  const model$ = Model$(initialModel)
  const actions = AudiooutputActions(model$, { getUserMedia })
  return { model$, actions }
}

export * from './Model'
export * from './Actions'
export {
  Audiooutput
}

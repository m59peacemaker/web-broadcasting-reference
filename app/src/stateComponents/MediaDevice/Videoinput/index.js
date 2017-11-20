import  makeMediaDeviceInfoIntoNormalObject from '../lib/make-media-device-into-normal-object'
import { VideoinputModel } from './Model'
import { VideoinputActions } from './Actions'

const Videoinput = (mediaDeviceInfo, { getUserMedia }) => {
  const initialModel = Object.assign(
    VideoinputModel(),
    makeMediaDeviceInfoIntoNormalObject(mediaDeviceInfo)
  )
  const model$ = {}
  const actions = VideoinputActions(model$, { getUserMedia })
  return { model$, actions }
}

export * from './Model'
export * from './Actions'
export {
  Videoinput
}

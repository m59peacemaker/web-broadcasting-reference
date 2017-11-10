import flyd from 'flyd'
import  makeMediaDeviceInfoIntoNormalObject from '../lib/make-media-device-into-normal-object'
import { AudioinputModel } from './Model'
import { AudioinputActions } from './Actions'

const Model$ = (initialState) => {
  const model$ = flyd.stream(initialState)
  const update = mapFn => model$(mapFn(model$()))
  const subscribe = listener => {
    const end$ = flyd.on(listener, model$)
    return () => end$(true)
  }
  return Object.assign(model$, { update, subscribe })
}

const Audioinput = (mediaDeviceInfo, { getUserMedia }) => {
  const initialModel = Object.assign(
    AudioinputModel(),
    makeMediaDeviceInfoIntoNormalObject(mediaDeviceInfo)
  )
  const model$ = Model$(initialModel)
  const actions = AudioinputActions(model$, { getUserMedia })
  return { model$, actions }
}

export * from './Actions'
export * from './Model'
export {
  Audioinput
}

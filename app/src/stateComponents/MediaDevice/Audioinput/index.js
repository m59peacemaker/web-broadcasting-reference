import  makeMediaDeviceInfoIntoNormalObject from '../lib/make-media-device-into-normal-object'
import { AudioinputModel } from './Model'
import { AudioinputActions } from './Actions'
import assignStreamHelpers from '../../../lib/assign-stream-helpers'
import { withStreamAtPaths } from '../../../lib/flyd-withStreamAtPath'
import flyd from 'flyd'

const Audioinput = (mediaDeviceInfo, { getUserMedia, audioContext }) => {
  const deviceInfo = makeMediaDeviceInfoIntoNormalObject(mediaDeviceInfo)
  const initialModel = Object.assign(
    AudioinputModel(),
  )
  const model$ = assignStreamHelpers(flyd.stream(initialModel))
  const publicModel$ = assignStreamHelpers(
    withStreamAtPaths([
    // TODO: figure out whether this model should be updating on every emit of state.volume
    // or maybe state.volume should just remain a stream that something can consume if it wants
      // but then it would have to check whether that stream has been updated to a different one
      // and then ugly-fest again
    // should raf() even be going on at this point? Maybe the analyser should just be handed out
      // and something can grab the analyser and call raf() and use it
      // though that would get back into ugly state territory... again
      //[ 'state', 'volume' ]
    ], model$)
  )

  const actions = AudioinputActions(model$, { getUserMedia, audioContext })

  return {
    model$: publicModel$,
    actions
  }
}

export * from './Model'
export * from './Actions'
export {
  Audioinput
}

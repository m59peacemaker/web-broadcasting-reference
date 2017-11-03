import flyd from 'flyd'
import MediaDevices from './services/media-devices'

const update$ = flyd.stream()

const mediaDevices = MediaDevices(update$)

const model$ = flyd.scan(
  (model, update$) => {
    return update$(model)
  },
  mediaDevices.model,
  update$
)

flyd.on(console.log, model$)

export default model$

export {
  update$,
  actions
}

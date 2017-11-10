import pipe from 'ramda/src/pipe'
import lensProp from 'ramda/src/lensProp'
import drop from 'ramda/src/drop'
import append from 'ramda/src/append'
import over from 'ramda/src/over'

const SharedActions = update => { // model update fn lensed to a kindGroup
  const activateNext = () => {
    update(model => {
      const deviceId = model.inactive[0]
      return pipe(
        over(lensProp('inactive'), drop(1)),
        over(lensProp('active'), append(deviceId))
      )(model)
    })
  }

  return {
    activateNext
  }
}

export default SharedActions

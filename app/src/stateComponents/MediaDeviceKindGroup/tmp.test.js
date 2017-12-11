import test from 'tape-catch'
import flyd from 'flyd'
import lift from 'flyd/module/lift'
import assoc from 'ramda/src/assoc'
import pipe from 'ramda/src/pipe'
import map from 'ramda/src/map'
import prop from 'ramda/src/prop'
import tap from 'ramda/src/tap'
import propPath from 'ramda/src/path'
import merge from 'flyd/module/mergeall'
import switchImmediate from '../../lib/flyd-switchImmediate'
import { AudioinputGroup } from './'
import { MediaDevice } from '../MediaDevice'

const fooMic = { deviceId: 'foo', label: 'Foo', groupId: '', kind: 'audioinput' }
const barMic = assoc('deviceId', 'bar', fooMic)

test.only('device group computed', t => {
  t.test('deviceModels emits array of models', t => {
    const audioinputGroup = AudioinputGroup()
    const { sources, model } = audioinputGroup

    const deviceModels = model.devices.map(
      pipe(Object.values, map(prop('model')))
    )

    t.deepEqual(deviceModels(), [])

    sources.actions.registerDevice(fooMic)

    t.deepEqual(deviceModels().map(prop('deviceId')), [ 'foo' ])

    sources.actions.registerDevice(barMic)

    t.deepEqual(deviceModels().map(prop('deviceId')), [ 'foo', 'bar' ])

    sources.actions.unregisterDevice(barMic)

    t.deepEqual(deviceModels().map(prop('deviceId')), [ 'foo' ])

    sources.actions.unregisterDevice(fooMic)

    t.deepEqual(deviceModels(), [])

    t.end()
  })

  t.test('model.connected emits array of connected device ids', t => {
    const audioinputGroup = AudioinputGroup()
    const { sources, model } = audioinputGroup

    const deviceModels = flyd.map
      (pipe(
        Object.values,
        map(prop('model'))
      ))
      (model.devices)

    const n = flyd.stream(1)
    const nPlus = n.map(v => v + 100)
    console.log(nPlus()) // 101

    flyd.stream(1).map(() => {
      const n = flyd.stream(1)
      const nPlus = n.map(v => v + 100)
      console.log(nPlus()) // undefined <-- BAD!
    })

    return t.end()

    const ff = pipe(
      flyd.map
        (models => {
          const dependencies = models.length
            ? map (propPath ([ 'state', 'connected' ])) (models)
            : [ flyd.stream([]) ]
            if (models.length) {
              t.equal(models.length, dependencies.length, `length: ${models.length}`)
              models.forEach(model => t.equal(typeof model, 'object', model.deviceId))
              dependencies.forEach(dep => t.true(flyd.isStream(dep), 'dependency is a stream'))
              dependencies.forEach(
                dep => t.notEqual(dep(), undefined, `dependency has a value: ${dep()}`)
              )
            }
          return flyd.endsOn(
            deviceModels,
            flyd.combine (() => models) (dependencies)
          )
        }),
      switchImmediate
    )(deviceModels)

    const connected = flyd.map
      (models => {
        return models
    //      .filter(model => model.state.connected())
     //     .map(prop('deviceId'))
      })
      (ff)

    t.deepEqual(connected(), [])

    sources.actions.registerDevice(fooMic)
    //sources.actions.registerDevice(barMic)

    //t.deepEqual(connected(), [ 'foo' ])
    /* t.deepEqual(model.disconnected(), []) */


    /* t.deepEqual(model.connected(), [ 'foo' ]) */
    /* t.deepEqual(model.disconnected(), []) */

    //sources.actions.registerDevice(barMic)

    //t.deepEqual(connected(), [ 'foo', 'bar' ])
    /* t.deepEqual(model.disconnected(), []) */

    t.end()
  })
})

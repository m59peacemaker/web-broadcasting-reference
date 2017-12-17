import test from 'tape-catch'
import * as W from 'wark'
import assoc from 'ramda/src/assoc'
import pipe from 'ramda/src/pipe'
import map from 'ramda/src/map'
import prop from 'ramda/src/prop'
import tap from 'ramda/src/tap'
import propPath from 'ramda/src/path'
import { AudioinputGroup } from './'
import { MediaDevice } from '../MediaDevice'

const fooMic = { deviceId: 'foo', label: 'Foo', groupId: '', kind: 'audioinput' }
const barMic = assoc('deviceId', 'bar', fooMic)

test('device group computed', t => {
  t.test('deviceModels emits array of models', t => {
    const audioinputGroup = AudioinputGroup()
    const { sources, model } = audioinputGroup

    const deviceModels = W.map
      (pipe(Object.values, map(prop('model'))))
      (model.devices)

    t.deepEqual(deviceModels(), [])

    sources.actions.registerDevice(fooMic)

    t.deepEqual(deviceModels.get().map(prop('deviceId')), [ 'foo' ])

    sources.actions.registerDevice(barMic)

    t.deepEqual(deviceModels.get().map(prop('deviceId')), [ 'foo', 'bar' ])

    sources.actions.unregisterDevice(barMic)

    t.deepEqual(deviceModels.get().map(prop('deviceId')), [ 'foo' ])

    sources.actions.unregisterDevice(fooMic)

    t.deepEqual(deviceModels(), [])

    t.end()
  })

  t.test('model.connected emits array of connected device ids', t => {
    const audioinputGroup = AudioinputGroup()
    const { sources, model } = audioinputGroup

    const deviceModels = W.map
      (pipe(
        Object.values,
        map(prop('model'))
      ))
      (model.devices)

    const n = W.Stream(1)
    const nPlus = W.map (v => v + 100) (n)
    console.log(nPlus.get()) // 101

    W.map
      (() => {
        const n = W.Stream(1)
        const nPlus = W.map (v => v + 100) (n)
        console.log(nPlus.get()) // undefined <-- BAD! TODO: gimme 101
      })
      (W.Stream(1))

    return t.end()

    const ff = pipe
      (
        W.map
          (models => {
            const dependencies = models.length
              ? map (propPath ([ 'state', 'connected' ])) (models)
              : [ W.Stream([]) ]
              if (models.length) {
                t.equal(models.length, dependencies.length, `length: ${models.length}`)
                models.forEach(model => t.equal(typeof model, 'object', model.deviceId))
                dependencies.forEach(dep => t.true(W.isStream(dep), 'dependency is a stream'))
                dependencies.forEach(
                  dep => t.notEqual(dep.get(), undefined, `dependency has a value: ${dep.get()}`)
                )
              }
            return W.endsOn
              ([ deviceModels ])
              (W.combine (() => models) (dependencies))
          }),
        W.switchImmediate
      )
      (deviceModels)

    const connected = W.map
      (models => {
        return models
    //      .filter(model => model.state.connected())
     //     .map(prop('deviceId'))
      })
      (ff)

    t.deepEqual(connected.get(), [])

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

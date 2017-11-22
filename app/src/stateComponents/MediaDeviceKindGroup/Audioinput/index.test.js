import test from 'tape-catch'
import assoc from 'ramda/src/assoc'
import { AudioinputGroup } from './'

const fooMic = { deviceId: 'foo', label: 'Foo', groupId: '', kind: 'audioinput' }
const barMic = assoc('deviceId', 'bar', fooMic)

test('AudioinputGroup', t => {
  t.test('registers devices', t => {
    const audioinputGroup = AudioinputGroup()
    const { sources, model } = audioinputGroup

    t.deepEqual(model.devices(), {})

    sources.actions.registerDevice(fooMic)

    t.true(model.devices().foo, 'from actions.register')
    t.equal(model.devices().foo.model.deviceId, 'foo')

    sources.messages.deviceConnection(barMic)

    t.true(model.devices().bar, 'from messages.deviceConnection')
    t.equal(model.devices().bar.model.deviceId, 'bar')

    t.end()
  })

  t.test('unregisters devices', t => {
    const audioinputGroup = AudioinputGroup()
    const { sources, model } = audioinputGroup

    sources.actions.registerDevice(fooMic)
    sources.messages.deviceConnection(barMic)

    t.true(model.devices().foo)
    t.true(model.devices().bar)

    sources.actions.unregisterDevice(fooMic)
    sources.actions.unregisterDevice(barMic)

    t.false(model.devices().foo)
    t.false(model.devices().bar)

    t.end()
  })

  t.test('requests device connection notification', t => {
    const audioinputGroup = AudioinputGroup()
    const { requests } = audioinputGroup

    t.true(requests.deviceConnectionNotifier())

    t.end()
  })
})

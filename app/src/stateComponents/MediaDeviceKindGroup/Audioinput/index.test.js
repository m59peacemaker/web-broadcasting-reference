import test from 'tape-catch'
import assoc from 'ramda/src/assoc'
import { AudioinputGroup } from './'

const fooMic = { deviceId: 'foo', label: 'Foo', groupId: '', kind: 'audioinput' }
const barMic = assoc('deviceId', 'bar', fooMic)

test('AudioinputGroup', t => {
  t.test('registers devices', t => {
    const audioinputGroup = AudioinputGroup()
    const { sources, model } = audioinputGroup

    t.deepEqual(model.devices.get(), {})

    sources.actions.registerDevice(fooMic)

    t.true(model.devices.get().foo, 'from actions.register')
    t.equal(model.devices.get().foo.model.deviceId, 'foo')

    sources.messages.deviceConnection(barMic)

    t.true(model.devices.get().bar, 'from messages.deviceConnection')
    t.equal(model.devices.get().bar.model.deviceId, 'bar')

    t.end()
  })

  t.test('unregisters devices', t => {
    const audioinputGroup = AudioinputGroup()
    const { sources, model } = audioinputGroup

    sources.actions.registerDevice(fooMic)
    sources.messages.deviceConnection(barMic)

    t.true(model.devices.get().foo)
    t.true(model.devices.get().bar)

    sources.actions.unregisterDevice(fooMic)
    sources.actions.unregisterDevice(barMic)

    t.false(model.devices.get().foo)
    t.false(model.devices.get().bar)

    t.end()
  })

  t.test('requests device connection notification', t => {
    const audioinputGroup = AudioinputGroup()
    const { requests } = audioinputGroup

    t.true(requests.deviceConnectionNotifier.get())

    t.end()
  })
})

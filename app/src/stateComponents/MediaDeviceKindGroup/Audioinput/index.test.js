import test from 'tape-catch'
import * as W from 'wark'
import * as R from 'ramda'
import * as RA from 'ramda-adjunct'
import { AudioinputGroup } from './'

const fooMic = { deviceId: 'foo', label: 'Foo', groupId: '', kind: 'audioinput' }
const barMic = R.assoc('deviceId', 'bar', fooMic)

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

  t.test('connected/disconnected', t => {
    const audioinputGroup = AudioinputGroup()
    const { sources, model } = audioinputGroup

    sources.actions.registerDevice(fooMic)

    t.deepEqual(model.connected.get(), [])
    t.deepEqual(model.disconnected.get(), [ 'foo' ])

    sources.messages.deviceConnection(barMic)

    // we rely on the state reported by the device - the connection message was just to let us know the device exists
    t.deepEqual(model.connected.get(), [])
    t.deepEqual(model.disconnected.get(), [ 'foo', 'bar' ])

    model.devices.get().bar.sources.messages.deviceConnection()

    t.deepEqual(model.connected.get(), [ 'bar' ])
    t.deepEqual(model.disconnected.get(), [ 'foo' ])

    model.devices.get().bar.sources.messages.deviceDisconnection()

    t.deepEqual(model.connected.get(), [])
    t.deepEqual(model.disconnected.get(), [ 'foo', 'bar' ])

    model.devices.get().bar.sources.messages.deviceConnection()
    model.devices.get().foo.sources.messages.deviceConnection()

    t.deepEqual(model.connected.get(), [ 'foo', 'bar' ])
    t.deepEqual(model.disconnected.get(), [])

    sources.actions.unregisterDevice(fooMic)

    t.deepEqual(model.connected.get(), [ 'bar' ])
    t.deepEqual(model.disconnected.get(), [])

    sources.actions.registerDevice(fooMic)

    t.deepEqual(model.connected.get(), [ 'bar' ])
    t.deepEqual(model.disconnected.get(), [ 'foo' ])

    model.devices.get().bar.sources.messages.deviceDisconnection()

    t.deepEqual(model.connected.get(), [ ])
    t.deepEqual(model.disconnected.get(), [ 'bar', 'foo' ])

    t.end()
  })

  t.test('active/inactive/activating/available', t => {
    const audioinputGroup = AudioinputGroup()
    const { sources, model } = audioinputGroup

    sources.actions.registerDevice(fooMic)
    sources.actions.registerDevice(barMic)

    t.deepEqual(model.active.get(), [])
    t.deepEqual(model.activating.get(), [])
    t.deepEqual(model.inactive.get(), [ 'foo', 'bar' ])
    t.deepEqual(model.available.get(), [])

    model.devices.get().bar.sources.messages.deviceConnection()
    model.devices.get().foo.sources.messages.deviceConnection()

    t.deepEqual(model.active.get(), [])
    t.deepEqual(model.activating.get(), [])
    t.deepEqual(model.inactive.get(), [ 'foo', 'bar' ])
    t.deepEqual(model.available.get(), [ 'foo', 'bar' ])

    model.devices.get().bar.sources.actions.activate()

    t.deepEqual(model.active.get(), [])
    t.deepEqual(model.activating.get(), [ 'bar' ])
    t.deepEqual(model.inactive.get(), [ 'foo', 'bar' ])
    t.deepEqual(model.available.get(), [ 'foo' ])

    model.devices.get().bar.sources.messages.userMediaTrack({})

    t.deepEqual(model.active.get(), [ 'bar' ])
    t.deepEqual(model.activating.get(), [])
    t.deepEqual(model.inactive.get(), [ 'foo' ])
    t.deepEqual(model.available.get(), [ 'foo' ])

    model.devices.get().foo.sources.actions.activate()

    t.deepEqual(model.active.get(), [ 'bar' ])
    t.deepEqual(model.activating.get(), [ 'foo' ])
    t.deepEqual(model.inactive.get(), [ 'foo' ])
    t.deepEqual(model.available.get(), [])

    model.devices.get().foo.sources.messages.userMediaTrack({})

    t.deepEqual(model.active.get(), [ 'foo', 'bar' ])
    t.deepEqual(model.activating.get(), [])
    t.deepEqual(model.inactive.get(), [])
    t.deepEqual(model.available.get(), [])

    sources.actions.unregisterDevice(barMic)

    t.deepEqual(model.active.get(), [ 'foo' ])
    t.deepEqual(model.activating.get(), [])
    t.deepEqual(model.inactive.get(), [])
    t.deepEqual(model.available.get(), [])

    model.devices.get().foo.sources.messages.deviceDisconnection(fooMic)

    t.deepEqual(model.active.get(), [])
    t.deepEqual(model.activating.get(), [])
    t.deepEqual(model.inactive.get(), [ 'foo' ])
    t.deepEqual(model.available.get(), [])

    t.end()
  })
})

import test from 'tape-universal'
import groupDevices from './group-devices'
import KindGroups from '../schema/KindGroups'
import Master from '../schema/Master'

test('groupDevices() takes an array of devices like that from enumerateDevices() and returns kindGroups', t => {
  const devices = [
    { deviceId: 'foo', kind: 'audiooutput' },
    { deviceId: 'bar', kind: 'videoinput' },
    { deviceId: 'baz', kind: 'audioinput' },
    { deviceId: 'qux', kind: 'audioinput' },
    { deviceId: 'qux', kind: 'videoinput' },
  ]
  t.deepEqual(groupDevices(devices), {
    videoinput: {
      connected: [],
      active: [],
      inactive: [ 'bar', 'qux' ],
      master: Master('videoinput'),
      devices: {
        bar: { deviceId: 'bar', kind: 'videoinput' },
        qux: { deviceId: 'qux', kind: 'videoinput' },
      }
    },
    audioinput: {
      connected: [],
      active: [],
      inactive: [ 'baz', 'qux' ],
      master: Master('audioinput'),
      devices: {
        baz: { deviceId: 'baz', kind: 'audioinput' },
        qux: { deviceId: 'qux', kind: 'audioinput' },
      }
    },
    audiooutput: {
      connected: [],
      active: [],
      inactive: [ 'foo' ],
      master: Master('audiooutput'),
      devices: {
        foo: { deviceId: 'foo', kind: 'audiooutput' },
      }
    }
  })
  t.end()
})

test('groupDevices() returns kindGroups even if the devices array is empty', t => {
  t.deepEqual(groupDevices([]), KindGroups())
  t.end()
})

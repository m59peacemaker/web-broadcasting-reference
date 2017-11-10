import test from 'tape-universal'
import flyd from 'flyd'
import * as R from 'ramda'
import MediaDevices from './'
import prepareDevice from './lib/prepare-device'
import KindGroup from './schema/KindGroup'

const kinds = [ 'videoinput', 'audioinput', 'audiooutput' ]

test('has kind groups', t => {
  const connectedDevices$ = flyd.stream([])
  const { model } = MediaDevices({ connectedDevices$ })
  const state = model()
  kinds.forEach(kind => t.deepEqual(state[kind], KindGroup(kind)))
  t.end()
})

test('when devices are connected, they are added to their groups', t => {
  const connectedDevices$ = flyd.stream([])
  const { model } = MediaDevices({ connectedDevices$ })
  const mic = { deviceId: 'mic', kind: 'audioinput' }
  const camera = { deviceId: 'camera', kind: 'videoinput' }
  connectedDevices$([ mic, camera ])
  t.deepEqual(R.path([ 'audioinput', 'devices', 'mic' ], model()), prepareDevice(mic))
  t.deepEqual(R.path([ 'videoinput', 'devices', 'camera' ], model()), prepareDevice(camera))
  t.end()
})

test('new devices are initially inactive', t => {
  const connectedDevices$ = flyd.stream([])
  const { model } = MediaDevices({ connectedDevices$ })
  const mic = { deviceId: 'mic', kind: 'audioinput' }
  connectedDevices$([ mic ])
  t.deepEqual(R.path([ 'audioinput', 'inactive' ], model()), [ 'mic' ])
  t.end()
})

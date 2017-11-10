import test from 'tape-universal'
import { Audioinput } from './'
import getUserMedia from '../../../test/lib/mock-get-user-media'

const micInfo = { deviceId: 'foo', label: 'Foo', groupId: '', kind: 'audioinput' }

test('activate / deactivate', t => {
  t.plan(6)

  const { model$, actions } = Audioinput(micInfo, { getUserMedia })

  actions.setConnected(true)

  actions.activate()
    .then(() => {
      const { activating, active, track } = model$().state
      t.false(activating, 'no longer activating')
      t.true(active, 'is active')
      t.true(track instanceof MediaStreamTrack, 'track is a MediaStreamTrack')

      actions.deactivate()

      t.deepEqual(model$().state, {
        track: null,
        error: null,
        active: false,
        activating: false,
        connected: true,
        volume: 0
      })
      t.equal(track.readyState, 'ended', 'deactive() stopped track')
    })
  t.true(model$().state.activating, 'is activating')
})

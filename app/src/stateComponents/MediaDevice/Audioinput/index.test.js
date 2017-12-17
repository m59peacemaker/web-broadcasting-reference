import test from 'tape-catch'
import * as W from 'wark'
import pipe from 'ramda/src/pipe'
import pick from 'ramda/src/pick'
import { Audioinput, AudioinputProcessingModeConfigs } from './'

const micInfo = { deviceId: 'foo', label: 'Foo', groupId: '', kind: 'audioinput' }

test('Audioinput', t => {
  t.test('has media device info', t => {
    const audioinput = Audioinput({ mediaDeviceInfo: micInfo })
    t.deepEqual(pick(Object.keys(micInfo), audioinput.model), micInfo)

    t.end()
  })

  t.test('does not try to activate while disconnected', t => {
    const audioinput = Audioinput({ mediaDeviceInfo: micInfo })
    const { model, sources, requests } = audioinput

    t.false(audioinput.sourceRejections.actions.activate.get())

    sources.actions.activate()

    t.true(audioinput.sourceRejections.actions.activate.get())
    t.equal(requests.userMediaTrack.get(), undefined)

    t.end()
  })

  t.test('recognizes connection', t => {
    const audioinput = Audioinput({ mediaDeviceInfo: micInfo })
    const { model, sources, requests } = audioinput

    t.false(model.state.connected.get())
    t.false(model.state.active.get())

    sources.messages.deviceConnection()

    t.true(model.state.connected.get())
    t.false(model.state.active.get())

    t.end()
  })

  t.test('recognizes disconnection', t => {
    const audioinput = Audioinput({ mediaDeviceInfo: micInfo })
    const { model, sources, requests } = audioinput

    sources.messages.deviceConnection()

    t.true(model.state.connected.get())

    sources.messages.deviceDisconnection()

    t.false(model.state.connected.get())

    t.end()
  })

  t.test('activate', t => {
    const audioinput = Audioinput({ mediaDeviceInfo: micInfo })
    const { model, sources, requests } = audioinput

    sources.messages.deviceConnection()
    sources.actions.activate()

    t.true(model.state.activating.get())
    t.false(model.state.track.get())
    t.true('constraints' in requests.userMediaTrack.get())

    sources.messages.userMediaTrack({ enabled: true })

    t.false(model.state.activating.get())
    t.true(model.state.active.get())
    t.true(model.state.track.get())

    t.end()
  })

  t.test('deactivate', t => {
    const audioinput = Audioinput({ mediaDeviceInfo: micInfo })
    const { model, sources, requests } = audioinput

    sources.messages.deviceConnection()
    sources.actions.activate()
    sources.messages.userMediaTrack({ enabled: true })
    sources.actions.deactivate()

    t.false(model.state.track.get())
    t.false(model.state.active.get())
    t.true(model.state.connected.get())

    t.end()
  })

  t.test('processing mode', t => {
    const audioinput = Audioinput({ mediaDeviceInfo: micInfo })
    const { model, sources, requests } = audioinput

    t.equal(model.settings.processing.mode.get(), 'voice')
    t.true(model.settings.processing.modeConfig.get().noiseSuppression)
    t.true(model.settings.processing.custom.noiseSuppression.get())

    sources.actions.disableNoiseSuppression()

    t.false(model.settings.processing.custom.noiseSuppression.get())
    t.true(model.settings.processing.modeConfig.get().noiseSuppression)

    sources.actions.setProcessingMode('custom')
    t.false(audioinput.anySourceRejection.get())

    t.false(model.settings.processing.custom.noiseSuppression.get())
    t.false(model.settings.processing.modeConfig.get().noiseSuppression)

    sources.actions.disableEchoCancellation()

    t.false(model.settings.processing.custom.echoCancellation.get())
    t.false(model.settings.processing.modeConfig.get().echoCancellation)

    sources.actions.setProcessingMode('voice')

    t.false(model.settings.processing.custom.echoCancellation.get())
    t.true(model.settings.processing.modeConfig.get().echoCancellation)

    t.true(model.settings.processing.modeConfig.get().noiseSuppression)

    sources.actions.setProcessingMode('ambient')

    t.false(model.settings.processing.modeConfig.get().noiseSuppression)

    sources.actions.setProcessingMode('fweh')
    t.true(audioinput.anySourceRejection.get(), audioinput.anySourceRejection.get())
    audioinput.anySourceRejection()

    t.end()
  })

  t.test('updating relevant settings causes mediaConstraints to be computed', t => {
    const audioinput = Audioinput({ mediaDeviceInfo: micInfo })
    const { model, sources, requests } = audioinput

    t.true(model.settings.stereo.get())
    t.equal(model.settings.mediaConstraints.get().channelCount, 2)

    sources.actions.disableStereo()

    t.equal(model.settings.mediaConstraints.get().channelCount, 1)
    t.true(model.settings.mediaConstraints.get().noiseSuppression)

    sources.actions.disableNoiseSuppression()

    t.true(model.settings.mediaConstraints.get().noiseSuppression)

    sources.actions.setProcessingMode('custom')

    t.false(model.settings.mediaConstraints.get().noiseSuppression)

    t.end()
  })

  t.test(
    'request to update constraints is created when there are new constraints if device is active',
    t => {
      const audioinput = Audioinput({ mediaDeviceInfo: micInfo })
      const { model, sources, requests } = audioinput

      /*const applyConstraintsRequests$ = pipe
        (
          W.filter (({ action }) => action === 'applyConstraints'),
          W.scan (requests => request => requests.concat(request)) ([])
        )
        (requests.audioTrackManager)
      */

      // TODO: ditch this when applyConstraints is supported
      const userMediaTrackRequests$ = W.scan
        (requests => request => requests.concat(request))
        ([])
        (requests.userMediaTrack)

      sources.messages.deviceConnection()
      sources.actions.activate()
      sources.messages.userMediaTrack({ enabled: true })

      t.true(model.state.active.get())
      t.true(model.state.track.get())
      t.true(model.settings.stereo.get())
      t.equal(model.settings.mediaConstraints.get().channelCount, 2)
      t.equal(userMediaTrackRequests$.get().length, 1)

      sources.actions.disableStereo()

      t.equal(userMediaTrackRequests$.get().length, 2)
      t.equal(model.settings.mediaConstraints.get().channelCount, 1)
      t.equal(model.settings.processing.mode.get(), 'voice')

      sources.actions.disableNoiseSuppression()

      // nothing should happen because we're on "voice" mode
      t.equal(userMediaTrackRequests$.get().length, 2)

      sources.actions.setProcessingMode('custom')

      t.equal(userMediaTrackRequests$.get().length, 3)

      t.end()
    }
  )

  t.test(
    'request to update constraints is NOT created when there are new constraints if device is not active',
    t => {
      const audioinput = Audioinput({ mediaDeviceInfo: micInfo })
      const { model, sources, requests } = audioinput

      const audioTrackManagerRequests$ = pipe
        (
          W.filter (({ action }) => action === 'applyConstraints'),
          W.scan (requests => request => requests.concat(request)) ([])
        )
        (requests.audioTrackManager)

      // TODO: ditch this when applyConstraints is supported
      const userMediaTrackRequestCount$ = W.scan
        (count => v => count + 1)
        (0)
        (requests.userMediaTrack)

      const assertNoRequests = () => {
        t.equal(audioTrackManagerRequests$.get().length, 0)
        t.equal(userMediaTrackRequestCount$.get(), 0)
      }

      t.equal(model.settings.mediaConstraints.get().channelCount, 2)

      sources.actions.disableStereo()

      t.equal(model.settings.mediaConstraints.get().channelCount, 1)

      assertNoRequests()

      sources.actions.setProcessingMode('custom')

      t.true(model.settings.processing.modeConfig.get().noiseSuppression)

      sources.actions.toggleNoiseSuppression()

      t.false(model.settings.processing.modeConfig.get().noiseSuppression)

      assertNoRequests()

      sources.messages.deviceConnection()
      sources.actions.toggleNoiseSuppression()

      assertNoRequests()

      sources.actions.activate()

      t.equal(userMediaTrackRequestCount$.get(), 1)

      sources.actions.toggleNoiseSuppression()

      t.equal(audioTrackManagerRequests$.get().length, 0)

      t.end()
    }
  )
})

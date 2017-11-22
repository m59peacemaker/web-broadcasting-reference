import test from 'tape-catch'
import flyd from 'flyd'
import filterStream from 'flyd/module/filter'
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

    sources.actions.activate(null)
    t.true(audioinput.anySourceRejection() instanceof Error)
    t.equal(requests.userMediaTrack(), undefined)

    t.end()
  })

  t.test('recognizes connection', t => {
    const audioinput = Audioinput({ mediaDeviceInfo: micInfo })
    const { model, sources, requests } = audioinput

    t.false(model.state.connected())
    t.false(model.state.active())

    sources.messages.deviceConnection(null)

    t.true(model.state.connected())
    t.false(model.state.active())

    t.end()
  })

  t.test('recognizes disconnection', t => {
    const audioinput = Audioinput({ mediaDeviceInfo: micInfo })
    const { model, sources, requests } = audioinput

    sources.messages.deviceConnection(null)
    t.true(model.state.connected())

    sources.messages.deviceDisconnection(null)
    t.false(model.state.connected())

    t.end()
  })

  t.test('activate', t => {
    const audioinput = Audioinput({ mediaDeviceInfo: micInfo })
    const { model, sources, requests } = audioinput

    sources.messages.deviceConnection(null)
    sources.actions.activate(null)

    t.true(model.state.activating())
    t.false(model.state.track())
    t.true('constraints' in requests.userMediaTrack())

    sources.messages.userMediaTrack({ enabled: true })

    t.false(model.state.activating())
    t.true(model.state.active())
    t.true(model.state.track())

    t.end()
  })

  t.test('deactivate', t => {
    const audioinput = Audioinput({ mediaDeviceInfo: micInfo })
    const { model, sources, requests } = audioinput

    sources.messages.deviceConnection(null)
    sources.actions.activate(null)
    sources.messages.userMediaTrack({ enabled: true })
    sources.actions.deactivate(null)

    t.false(model.state.track())
    t.false(model.state.active())
    t.true(model.state.connected())

    t.end()
  })

  t.test('processing mode', t => {
    const audioinput = Audioinput({ mediaDeviceInfo: micInfo })
    const { model, sources, requests } = audioinput

    t.equal(model.settings.processing.mode(), 'voice')
    t.true(model.settings.processing.modeConfig().noiseSuppression)
    t.true(model.settings.processing.custom.noiseSuppression())

    sources.actions.disableNoiseSuppression(null)

    t.false(model.settings.processing.custom.noiseSuppression())
    t.true(model.settings.processing.modeConfig().noiseSuppression)

    sources.actions.setProcessingMode('custom')
    t.false(audioinput.anySourceRejection())

    t.false(model.settings.processing.custom.noiseSuppression())
    t.false(model.settings.processing.modeConfig().noiseSuppression)

    sources.actions.disableEchoCancellation(null)

    t.false(model.settings.processing.custom.echoCancellation())
    t.false(model.settings.processing.modeConfig().echoCancellation)

    sources.actions.setProcessingMode('voice')

    t.false(model.settings.processing.custom.echoCancellation())
    t.true(model.settings.processing.modeConfig().echoCancellation)

    t.true(model.settings.processing.modeConfig().noiseSuppression)

    sources.actions.setProcessingMode('ambient')

    t.false(model.settings.processing.modeConfig().noiseSuppression)

    sources.actions.setProcessingMode('fweh')
    t.true(audioinput.anySourceRejection(), audioinput.anySourceRejection())
    audioinput.anySourceRejection(null)

    t.end()
  })

  t.test('updating relevant settings causes mediaConstraints to be computed', t => {
    const audioinput = Audioinput({ mediaDeviceInfo: micInfo })
    const { model, sources, requests } = audioinput

    t.true(model.settings.stereo())
    t.equal(model.settings.mediaConstraints().channelCount, 2)

    sources.actions.disableStereo(null)

    t.equal(model.settings.mediaConstraints().channelCount, 1)

    t.true(model.settings.mediaConstraints().noiseSuppression)

    sources.actions.disableNoiseSuppression(null)

    t.true(model.settings.mediaConstraints().noiseSuppression)

    sources.actions.setProcessingMode('custom')

    t.false(model.settings.mediaConstraints().noiseSuppression)

    t.end()
  })

  t.test(
    'request to update constraints is created when there are new constraints if device is active',
    t => {
      const audioinput = Audioinput({ mediaDeviceInfo: micInfo })
      const { model, sources, requests } = audioinput

      const audioTrackManagerRequests$ = pipe(
        filterStream(({ action }) => action === 'applyConstraints'),
        flyd.scan((requests, request) => requests.concat(request), [])
      )(requests.audioTrackManager)

      // TODO: ditch this when applyConstraints is supported
      const userMediaTrackRequestCount$ = flyd.scan(count => count + 1, 0, requests.userMediaTrack)

      sources.messages.deviceConnection(null)
      sources.actions.activate()
      sources.messages.userMediaTrack({ enabled: true })

      t.true(model.state.active())
      t.true(model.state.track())
      t.true(model.settings.stereo())
      t.equal(model.settings.mediaConstraints().channelCount, 2)

      sources.actions.disableStereo(null)

      t.equal(model.settings.mediaConstraints().channelCount, 1)

      t.equal(userMediaTrackRequestCount$(), 1)
      t.equal(audioTrackManagerRequests$().length, 1)

      t.equal(model.settings.processing.mode(), 'voice')

      sources.actions.disableNoiseSuppression(null)

      // nothing should happen because we're on "voice" mode
      t.equal(userMediaTrackRequestCount$(), 1)
      t.equal(audioTrackManagerRequests$().length, 1)

      sources.actions.setProcessingMode('custom')

      t.equal(userMediaTrackRequestCount$(), 2)
      t.equal(audioTrackManagerRequests$().length, 2)

      t.end()
    }
  )

  t.test(
    'request to update constraints is NOT created when there are new constraints if device is not active',
    t => {
      const audioinput = Audioinput({ mediaDeviceInfo: micInfo })
      const { model, sources, requests } = audioinput

      const audioTrackManagerRequests$ = pipe(
        filterStream(({ action }) => action === 'applyConstraints'),
        flyd.scan((requests, request) => requests.concat(request), [])
      )(requests.audioTrackManager)

      // TODO: ditch this when applyConstraints is supported
      const userMediaTrackRequestCount$ = flyd.scan(count => count + 1, 0, requests.userMediaTrack)

      const assertNoRequests = () => {
        t.equal(audioTrackManagerRequests$().length, 0)
        t.equal(userMediaTrackRequestCount$(), 0)
      }

      t.equal(model.settings.mediaConstraints().channelCount, 2)

      sources.actions.disableStereo(null)

      t.equal(model.settings.mediaConstraints().channelCount, 1)

      assertNoRequests()

      sources.actions.setProcessingMode('custom')

      t.true(model.settings.processing.modeConfig().noiseSuppression)
      sources.actions.toggleNoiseSuppression(null)
      t.false(model.settings.processing.modeConfig().noiseSuppression)

      assertNoRequests()

      sources.messages.deviceConnection(null)
      sources.actions.toggleNoiseSuppression(null)

      assertNoRequests()

      sources.actions.activate(null)
      t.equal(userMediaTrackRequestCount$(), 1)

      sources.actions.toggleNoiseSuppression(null)
      t.equal(audioTrackManagerRequests$().length, 0)

      t.end()
    }
  )
})

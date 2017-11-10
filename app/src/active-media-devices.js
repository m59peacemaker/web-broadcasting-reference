import flyd from 'flyd'
const { stream, map, scan } = flyd
import flatMap from 'flyd/module/flatmap'
import mediaDevices$ from './media-devices'
import append from 'ramda/src/append'
import remove from 'ramda/src/remove'
import over from 'ramda/src/over'
import lensProp from 'ramda/src/lensProp'
import lensPath from 'ramda/src/lensPath'
import Rmap from 'ramda/src/map'
import not from 'ramda/src/not'
import TrackVolumeAnalyser from '../lib/track-volume-analyser'
import Frames from 'flyd-onanimationframe'
import flydObj from 'flyd-obj'
import FrameStream from '../lib/frame-stream'

// TODO: share this context in a globally accessible module
const audioContext = new AudioContext()

const actions$ = stream()

const template = () => ({
  audioinput: [],
  videoinput: []
})

const findActiveDeviceById = (activeDevices, deviceId) =>
  activeDevices.find(activeDevice => activeDevice.deviceId === deviceId)

const findFirstInactiveDevice = (devices, activeDevices) => {
  const deviceId = Object
    .keys(devices)
    .find(deviceId => findActiveDeviceById(activeDevices, deviceId) === undefined)
  return deviceId ? devices[deviceId] : undefined
}

const actions = {
  activate: (state, { kind }) => {
    const device = findFirstInactiveDevice(mediaDevices$()[kind], state[kind])
    const frames$ = FrameStream()
    const track$ = stream()
    const volumeAnalyser$ = flyd.map(track => TrackVolumeAnalyser(audioContext, track), track$)
    const volume$ = flyd.combine(
      (analyser$, frame$) => analyser$().getVolume(),
      [ volumeAnalyser$, frames$ ]
    )

    const constraints = { deviceId: device.deviceId }
    window.navigator.mediaDevices.getUserMedia({ [kind.replace(/input$/, '') ]: constraints })
      .then(stream => track$(stream.getAudioTracks()[0]))

    const input = {
      deviceId: device.deviceId,
      error: false,
      monitoring: false,
      muted: false,
      track: track$,
      volume: volume$,
      volumeAnalyser: volumeAnalyser$
    }
    return over(
      lensProp(kind),
      append(input),
      state
    )
  },
  deactivate: (state, { kind, index }) => {
    if (!state[kind][index]) {
      throw new Error(`attempted to deactivate ${kind} at { index: ${index} }, but there are only ${state[kind].length} ${kind} devices active.`)
    }
    return over(
      lensProp(kind),
      remove(index, 1),
      state
    )
  },
  toggleMute: (state, { kind, index }) => {
    return over(
      lensPath([ kind, index, 'muted' ]),
      not,
      state
    )
  }
}

const activeMediaDevices$ = scan((acc, { action, payload }) => {
  const handler = actions[action]

  if (!handler) {
    throw new Error(`"${action}" is not a known action.`)
  }

  return handler(acc, payload)
}, template(), actions$)

activeMediaDevices$.request = actions$

export default activeMediaDevices$

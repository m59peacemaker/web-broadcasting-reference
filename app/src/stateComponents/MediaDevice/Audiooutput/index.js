const Audiooutput = () => {
  return {

  }
}

const AudiooutputModelOverlay = () => ({

})

const AudiooutputModel = () => mergeDeep(MediaDeviceModel(), AudiooutputModelOverlay())

export {
  Audiooutput,
  AudiooutputModel,
  AudiooutputModelOverlay
}

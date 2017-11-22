const AudioinputMasterModel = () => mergeDeep.all([
  //MediaDeviceMasterModel(),
  //AudioinputInitialStateMixin(),
  {
    kind: 'audioinput'
  }
])

export {
  AudioinputMasterModel
}

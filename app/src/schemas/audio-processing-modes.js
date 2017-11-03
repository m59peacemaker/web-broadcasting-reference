export default {
  voice: () => ({
    echoCancellation: true,
    noiseSuppression: true,
    autoGainControl: true
  }),
  ambient: () => ({
    echoCancellation: true,
    noiseSuppression: false,
    autoGainControl: false
  })
}

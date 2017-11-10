import Master from './Master'

export default kind => ({
  devices: {}, // [kind]Device
  master: Master(kind),
  connected: [], // ...deviceIds
  active: [], // ...deviceIds
  inactive: [] // ...deviceIds
})

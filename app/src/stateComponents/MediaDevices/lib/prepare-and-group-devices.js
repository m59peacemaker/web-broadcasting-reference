import map from 'ramda/src/map'
import pipe from 'ramda/src/pipe'
import groupDevices from './group-devices'
import prepareDevice from './prepare-device'

const prepareDevices = map(prepareDevice)

export default pipe(prepareDevices, groupDevices)

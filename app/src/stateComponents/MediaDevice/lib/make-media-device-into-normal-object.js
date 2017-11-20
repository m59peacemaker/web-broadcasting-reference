import pick from 'ramda/src/pick'
import { MediaDeviceInfo } from '../Device'

export default pick(Object.keys(MediaDeviceInfo()))

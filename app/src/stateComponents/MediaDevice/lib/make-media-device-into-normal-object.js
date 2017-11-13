import pick from 'ramda/src/pick'
import { MediaDeviceInfoModel } from '../Device'

export default pick(Object.keys(MediaDeviceInfoModel()))

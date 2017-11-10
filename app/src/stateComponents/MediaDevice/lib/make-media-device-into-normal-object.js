import pick from 'ramda/src/pick'
import { MediaDeviceInfoModel } from '../Model'

export default pick(Object.keys(MediaDeviceInfoModel()))

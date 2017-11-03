import { normalize, schema } from 'normalizr'
import map from 'ramda/src/map'
import pick from 'ramda/src/pick'
import Model from './model'

const kinds = Object.keys(Model())
const mediaDeviceInfo = {
  deviceId: '',
  groupId: '',
  kind: '',
  label: ''
}
const makeNormalObjects = map(pick(Object.keys(mediaDeviceInfo)))

const schemas = kinds
  .reduce((schemas, kind) => {
    schemas[kind] = new schema.Entity(kind, {}, { idAttribute: 'deviceId' })
    return schemas
  }, {})

const mediaDevicesSchema = new schema.Array(schemas, 'kind')

const normalizeMediaDevices = devices => {
  const normalizedDevices = normalize(
    makeNormalObjects(devices),
    mediaDevicesSchema
  ).entities
  return Object.assign(Model(), normalizedDevices)
}

export default mediaDevicesSchema

export {
  normalizeMediaDevices
}

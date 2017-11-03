import { normalize, schema } from 'normalizr'

const template = () => ({ videoinput: {}, audioinput: {}, audiooutput: {} })
const kinds = Object.keys(template())

const schemas = kinds
  .reduce((schemas, kind) => {
    schemas[kind] = new schema.Entity(kind, {}, { idAttribute: 'deviceId' })
    return schemas
  }, {})
const mediaDevicesSchema = new schema.Array(schemas, 'kind')
const normalizeMediaDevices = v =>
  Object.assign(template(), normalize(v, mediaDevicesSchema).entities)

export default mediaDevicesSchema

export {
  normalizeMediaDevices
}

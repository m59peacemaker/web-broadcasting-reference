import pick from 'ramda/src/pick'

const infoKeys = [ 'deviceId', 'groupId', 'kind', 'label' ]

export default pick(infoKeys)

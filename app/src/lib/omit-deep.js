import curry from 'ramda/src/curry'
import omit from 'ramda/src/omit'
import over from 'ramda/src/over'

const omitDeep = curry((props, obj) => props.reduce(
  (acc, v) => Array.isArray(v) ? over(lensProp(v[0]), omitDeep(v.slice(1)), acc) : omit([ v ], acc),
  obj
))

export default omitDeep

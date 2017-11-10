import Rover from 'ramda/src/over'
import lensProp from 'ramda/src/lensProp'
import lensPath from 'ramda/src/lensPath'
import not from 'ramda/src/not'
import __ from 'ramda/src/__'
import T from 'ramda/src/T'
import F from 'ramda/src/F'
import curry from 'ramda/src/curry'
import always from 'ramda/src/always'

const lens = path => Array.isArray(path)
  ? lensPath(path)
  : lensProp(path)

const over = curry(
  (path, fn, data) => Rover(lens(path), fn, data)
)

const toggle = over(__, not)

const set = curry(
  (path, value, data) => over(path, always(value), data)
)

const toTrue = over(__, T)
const toFalse = over(__, F)

export {
  over,
  set,
  toggle,
  toTrue,
  toFalse
}

import filter from 'flyd/module/filter'

const filterSplit = (pred, stream) => [
  filter(pred, stream),
  filter(v => !pred(v), stream)
]

export default filterSplit

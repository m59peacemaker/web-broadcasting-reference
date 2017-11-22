const getMany = function (props) {
  return props.reduce((acc, prop) => {
    acc[prop] = this.get(prop)
    return acc
  }, {})
}

export default getMany

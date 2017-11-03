const createStore = initialState => {
  let state = initialState
  let listeners = []

  const getState = () => {
    return state
  }

  const subscribe = listener => {
    listeners.push(listener)
    listener(state)
  }

  const compute = (watch, fn) => {

  }

  const update = fn => {
    state = fn(state)
    listeners.forEach(fn => fn(state))
  }

  return { getState, update, subscribe }
}

export default createStore

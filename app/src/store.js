import { createStore, combineReducers } from 'redux'
import mediaDevices from './reducers/media-devices'

const reducers = {

}

const store = createStore(combineReducers(reducers), {})

export default store

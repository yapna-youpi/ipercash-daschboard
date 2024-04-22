import { combineReducers, createStore } from "redux"

import usersReducers from './users/reducers'

const rootReducer=combineReducers({
    user: usersReducers
})

export default createStore(rootReducer)
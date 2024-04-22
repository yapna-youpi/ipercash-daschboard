import { combineReducers } from "redux"

import ACTIONS from './constants'

export default combineReducers({
    user: (user = null, action) => {
        switch (action.type) {
            case ACTIONS.SET_CURRENT_USER:
                return action.payload
            case ACTIONS.UPDATE_CURRENT_USER:
                return action.payload
            case ACTIONS.REMOVE_CURRENT_USER:
                return null
            default:
                return user
        }
    },
    list: (list = [], action) => {
        switch (action.type) {
            case ACTIONS.SET_USERS_LIST:
                return action.payload
            case ACTIONS.PUSH_USERS:
                return [...list, action.payload]
            case ACTIONS.CLEAR_USERS_LIST:
                return []
            default:
                return list
        }
    }
})
import ACTIONS from './constants'

export const setUser=(user)=>({
    type: ACTIONS.SET_CURRENT_USER,
    payload: user
})

export const updateUser=(newUser)=>({
    type: ACTIONS.UPDATE_CURRENT_USER,
    payload: newUser
})

export const removeUser=()=>({
    type: ACTIONS.REMOVE_CURRENT_USER
})

export const setUsersList=(users)=>({
    type: ACTIONS.SET_USERS_LIST,
    payload: users
})

export const pushUsersList=(newUsers)=>({
    type: ACTIONS.PUSH_USERS,
    payload: newUsers
})

export const clearUsersList=()=>({
    type: ACTIONS.CLEAR_USERS_LIST
})
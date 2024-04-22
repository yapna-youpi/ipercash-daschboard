import React, { useState, createContext, useContext } from "react"
import { useDispatch } from "react-redux"
import { useSelector } from "react-redux"

import { setUser, removeUser } from "../../store/users/actions"
import { selectUser } from "../../store/users/selectors"

const authContext=createContext(null)

export const ProvideAuth=({ children })=>{
    const auth=useProvideAuth()
    return (
        <authContext.Provider value={auth} >
            {children}
        </authContext.Provider>
    )
}

export function useProvideAuth() {
    // const [user, setUser]=useState(null)
    const user=useSelector(selectUser)
    const dispatch=useDispatch()
    
    const signin=(data, callback)=>{
        // setUser(data)
        dispatch(setUser(data))
        callback()
    }
    const signout=(callback)=>{
        // setUser(null)
        dispatch(removeUser())
        callback()
    }

    return { user, signin, signout }
}

export function useAuth() {
    return useContext(authContext)
}

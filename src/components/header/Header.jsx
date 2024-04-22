import React, { useState, useEffect } from 'react'
import { VscBell } from 'react-icons/vsc'
import { FiArrowLeft } from 'react-icons/fi'
import { useHistory } from 'react-router-dom'

import { useAuth } from '../context/auth'
import { getToApi } from '../../functions/utilsFunctions'

import './header.css'
import logo from '../../assets/images/logo.png'

let interval = null

function Header() {
    let { user } = useAuth()
    const [notifs, setNotifs] = useState({ n: 0, problem: false })
    const history = useHistory()
    useEffect(() => {
        getNotifs()
        interval = setInterval(() => {
            getNotifs()
        }, 600 * 1000)

        return () => {
            // console.log("the interval ", interval)
            clearInterval(interval)
        }
    }, [])


    const getNotifs = () => {
        getToApi('getnotifsinfos')
            .then(data => {
                if (data) setNotifs(data)
            })
    }
    // console.log("the user ", user)
    // console.log("infos ", notifs)
    return (
        <div className="header box-shadows">
            <div className="go-back" onClick={()=>history.goBack()}>
                <FiArrowLeft size={30} />
            </div>
            <div className="notifs" onClick={() => history.push('/notifications')}>
                {notifs.n ? <div className={notifs.problem ? "number problem" : "number"}>{notifs.n}</div> : ""}
                <VscBell size={38} />
            </div>
            <div className="user">
                <img src={logo} alt="" />
                <h4>{user.userName}</h4>zz
            </div>
            {/* {<div className="beta-div">
                Sandbox
            </div>} */}
        </div>
    )
}

export default Header
import React, { useEffect } from 'react'
import { FiArrowLeft } from 'react-icons/fi'
import { useHistory } from 'react-router-dom'

import { useAuth } from '../context/auth'

import './header.css'
import logo from '../../assets/images/logo.png'


function PartnerHeader() {
    let { user } = useAuth()
    const history = useHistory()
    useEffect(() => {
    }, [])

    return (
        <div className="partner-header box-shadows">
            <div className="go-back" onClick={() => history.goBack()}>
                <FiArrowLeft size={30} />
            </div>
            <div className="user">
                <img src={logo} alt="" />
                <h4>{user.userName}</h4>
            </div>
        </div>
    )
}

export default PartnerHeader
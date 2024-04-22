import React, { useState, createRef } from 'react'
import { BiLockOpenAlt } from 'react-icons/bi'
import { useHistory, useLocation } from 'react-router-dom'
import ReactLoading from 'react-loading'

import { postToApi } from '../../functions/utilsFunctions'
import { toastify } from '../shared/toast/Toast'
import crypt from '../../functions/crypt'
import { useAuth } from '../context/auth'

import './login.css'

function Login() {
    const [loading, setLoading] = useState(false)
    const [email, password] = [createRef(), createRef()]
    let history = useHistory()
    let location = useLocation()
    let { from } = location.state || { from: { pathname: "/" } }
    const { signin } = useAuth()

    const handleSubmit = (e) => {
        e.preventDefault()
        setLoading(true)
        const params = { email: email.current.value, password: password.current.value }
        const message = crypt(JSON.stringify(params))
        // console.log("the crypt ", message)
        // return
        login(message).then(() => setLoading(false))
        return false
    }
    const login = async (params) => {
        return await postToApi('login', params)
            .then(data => {
                if (!data) toastify('error', "Login failed", 10 * 1000)
                else {
                    if (data.userId) {
                        toastify('greet', `Hello ${data.userName}`)
                        if(data.role.includes('Partner')) from.pathname='/partner'
                        setTimeout(() => signin(data, () => history.replace(from)), 500)
                        // console.log(signin, from)
                    }
                    else toastify('error', data.error)
                }
            })
    }
    return (
        <div className="login">
            <div className="bubble login-container">
                <form className="login-form" onSubmit={(e) => handleSubmit(e)}>
                    <div className="icon">
                        <BiLockOpenAlt size={50} color="#c31432" />
                    </div>
                    <h1>Login</h1>
                    <input type="email" ref={email} required placeholder='Email' />
                    <input type="password" ref={password} required placeholder='Password' />
                    <button>
                        {loading ? <ReactLoading type="spin" color='#FFF' height={30} width={30} /> : "Login"}
                    </button>
                    <span className='forgot-password' onClick={()=>history.push('/forget')}>Mot de passe oublié ?</span>
                </form>
            </div>
        </div>
    )
}

export default Login
import React, { useState, createRef } from 'react'
import { BiLockOpenAlt } from 'react-icons/bi'
import { useHistory, useLocation } from 'react-router-dom'
import ReactLoading from 'react-loading'

import { postToApi } from '../../functions/utilsFunctions'
import { toastify } from '../shared/toast/Toast'
import crypt from '../../functions/crypt'

import './forget.css';

function Forget() {
    const [loading, setLoading] = useState(false);
    const [email] = [createRef(), createRef()];
    const _handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        const response = await postToApi('forget', { email: email.current.value });
        console.log("the response of forget", response);
        if (response.mail) {
            setTimeout(() => { history.push('/login'); }, 500);
            toastify('info', "Vous allez recevoir un mail pour modifier votre mot de passe", 8000);
        }
        else toastify('error', "Adresse email non trouvé");
        setLoading(false);
        return false;
    };
    let history = useHistory();
    return (
        <div className="forget">
            <div className="forget-container">
                <form className="forget-form" onSubmit={_handleSubmit}>
                    <div className="icon">
                        <BiLockOpenAlt size={50} color="#c31432" />
                    </div>
                    <h1>Mot de passe oublié ?</h1>
                    <input type="email" ref={email} required placeholder='Entrez votre email' />
                    <button>
                        {loading ? <ReactLoading type="spin" color='#FFF' height={30} width={30} /> : "Envoyer"}
                    </button>
                    <span className='forgot-password' onClick={() => history.push('/login')}>Retourner au login</span>
                </form>
            </div>
        </div>
    )
}

export default Forget
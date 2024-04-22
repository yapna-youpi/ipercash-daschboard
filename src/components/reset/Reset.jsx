import React, { useState, createRef } from 'react';
import { BiLockOpenAlt } from 'react-icons/bi';
import { useHistory, useLocation } from 'react-router-dom';
import ReactLoading from 'react-loading';

import { postToApi } from '../../functions/utilsFunctions';
import { toastify } from '../shared/toast/Toast';

import './reset.css';

function Reset() {
    const [loading, setLoading] = useState(false);
    const [password, password2] = [createRef(), createRef()];
    let history = useHistory();
    const _handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        if (password.current.value !== password2.current.value) toastify('error', "Les mots de passe ne correspondent pas");
        else {
            const response = await postToApi('reset', { password: password.current.value, time: history.location.pathname.split('/')[2] });
            console.log("the response of reset", response);
            if (response.success) {
                setTimeout(() => { history.push('/login'); }, 500);
                toastify('success', "Mot de passe modifié");
            } else toastify('error', "Echec de la modification du mot de passe");
        }
        setLoading(false);
        return false;
    }
    const id = history.location.pathname.split('/')[2];
    // console.log("the id", id);
    // console.log("the location ", useLocation());
    return (
        <div className="reset">
            <div className="reset-container">
                <form className="reset-form" onSubmit={_handleSubmit}>
                    <div className="icon">
                        <BiLockOpenAlt size={50} color="#c31432" />
                    </div>
                    <h1>Reinitialisez votre mot de passe</h1>
                    <input type="password" ref={password} required placeholder='Nouveau mot de passe' minLength={8} />
                    <input type="password" ref={password2} required placeholder='Confirmer le mot de passe' minLength={8} />
                    <button>
                        {loading ? <ReactLoading type="spin" color='#FFF' height={30} width={30} /> : "Reinitialiser"}
                    </button>
                    <span className='forgot-password' onClick={() => history.push('/login')}>Retourner au login</span>
                </form>
            </div>
        </div>
    )
}

export default Reset
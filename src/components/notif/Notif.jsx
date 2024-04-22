import React, { useState, useEffect } from 'react'
import { FaEye, FaEyeSlash, FaThumbsUp, FaArrowLeft } from 'react-icons/fa'
import dateFormat from 'dateformat'
import ReactLoading from 'react-loading'

import { detectOperation, getToApi, postToApi } from '../../functions/utilsFunctions'
import { toastify } from '../shared/toast/Toast'

import './notif.css'
import Skel from '../shared/skeleton/Skel'

function Notif({ history }) {
    const [state, setState] = useState({ ts: {}, user: {} })
    const [loading, setLoading] = useState(true)
    const [load, setLoad] = useState(false)
    useEffect(() => {
        getData()
        return () => {

        }
    }, [])

    let data = history.location.state
    const getData = async () => {
        try {
            setLoading(true)
            let ts = await getToApi('gettransaction/' + data.transaction_id)
                .then(res => {
                    if (res && res.success) return res.ts
                    else return {}
                })
                .catch(error => { })
            if (ts.userId) {
                let user = await getToApi('getuser/' + ts.userId)
                    .then(user => user).catch(error => { })
                setState({ ts, user })
            }
            setLoading(false)
        } catch (error) {
            console.log("there is an error on getData ", error)
        }
    }
    const solve = (id) => {
        setLoad(true)
        postToApi('updatenotif', { id: id, params: { solved: true } })
            .then(res => {
                console.log("the res ", res)
                if (res && res.success) toastify('success', "réglé")
                else toastify('error', "Echec")
                setLoad(false)
            })
        // setTimeout(() => {

        // setLoad(false)
        // }, 2000);
    }

    // console.log("the data ", data)
    return (
        <div className="notification">
            <div className="back" title='retour' onClick={() => history.goBack()}>
                <FaArrowLeft size={30} />
            </div>
            {
                loading ? <Skeleton /> : (
                    <div className="notif shadows">
                        <div className="operation">
                            <h2>Operation : {detectOperation(data.transaction_id)} </h2>
                            <div className="line">
                                <span>Identifiant : </span>
                                <span className='tx-id' onClick={() => history.push('/transaction/:' + data.transaction_id)} >{data.transaction_id}</span>
                            </div>
                            <div className="line">
                                <span>Montant : </span>
                                <span>{state.ts.amountFiat} XAF</span>
                            </div>
                            <div className="line">
                                <span>Pays destinataire : </span>
                                <span>Cameroun</span>
                            </div>
                            <div className="line">
                                <span>Numero telephone : </span>
                                <span>{state.ts.phone}</span>
                            </div>
                            <div className="line">
                                <span>Date : </span>
                                <span>{dateFormat(state.ts.created_at, "dddd, d mmmm, yyyy")}</span>
                            </div>
                            <div className="line">
                                <span>Message : </span>
                                <span>{data.message}</span>
                            </div>
                        </div>
                        <div className="user">
                            <h2> Information Client </h2>
                            <div className="line">
                                <span>Nom : </span>
                                <span>{state.user.name}</span>
                            </div>
                            <div className="line">
                                <span>Email : </span>
                                <span>{state.user.email}</span>
                            </div>
                            <div className="line">
                                <span>Pays client : </span>
                                <span>{state.user.country ? state.user.country.split('_')[0] : ""}</span>
                            </div>
                            <div className="line">
                                <span>Telephone : </span>
                                <span>{state.user.phone}</span>
                            </div>
                        </div>
                        <div className="actions">
                            <h2> Actions </h2>
                            <div className="button">
                                {/* <button className='see' >
                                        {true ? <FaEyeSlash size={20} color="white" /> : <FaEye size={20} color="white" />}
                                    </button> */}
                                <button className='solve' onClick={() => solve(data.transaction_id)} >
                                    {
                                        load ? <center><ReactLoading type="spin" color='#FFF' height={25} width={25} /></center>
                                            : <FaThumbsUp size={20} color="white" />
                                    }

                                </button>
                            </div>
                        </div>

                    </div>)
            }
        </div>
    )
}

const Skeleton = () => {
    return (

        <div className="notif shadows">
            <div className="operation">
                <h2> <Skel /> </h2>
                <div className="line">
                    <Skel />
                </div>
                <div className="line">
                    <Skel />
                </div>
                <div className="line">
                    <Skel />
                </div>
                <div className="line">
                    <Skel />
                </div>
                <div className="line">
                    <Skel />
                </div>
                <div className="line">
                    <Skel />
                </div>
            </div>
            <div className="user">
                <h2> <Skel /> </h2>
                <div className="line">
                    <Skel />
                </div>
                <div className="line">
                    <Skel />
                </div>
                <div className="line">
                    <Skel />
                </div>
                <div className="line">
                    <Skel />
                </div>
            </div>
            <div className="actions">
                <h2> <Skel /> </h2>
                <div className="button">
                    <Skel />
                </div>
            </div>

        </div>
    )
}


export default Notif

/*
--- information d'une notification
identifiant de la transaction
type de transaction
montant de la transaction
nom du client
email client
message de la notification
date de la transaction
etape de la transaction
*/
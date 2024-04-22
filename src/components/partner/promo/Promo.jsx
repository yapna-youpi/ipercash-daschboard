import React, { useState, useEffect } from 'react'
import dateFormat from 'dateformat'

import { postToApi } from '../../../functions/utilsFunctions'
import { useAuth } from '../../context/auth'

import './promo.css'
import Skel from '../../shared/skeleton/Skel'

function Promo() {
    let { user } = useAuth()
    const [code, setCode] = useState({ code: {}, txs: [], })
    const [loading, setLoading] = useState(true)
    useEffect(() => {
        getCode()
    }, [])

    const getCode = async () => {
        setLoading(true)
        let id = user.role.split('_')[2]
        let response = await postToApi('promo/getcode', { code: id }, false)
        if (!response)  {
            setCode({ code: null, txs: null, users: null })
            return setLoading(false)
        }
        let { usages } = await postToApi('promo/getusages', { code: id }, false)
        setCode({ code: response.code, txs: usages })
        setLoading(false)
    }
    const calculGains = () => {
        let amount = 0
        if (!code.txs) return 0
        code.txs.map(item => amount += item.amount)
        return (amount * code.code.percent / 100).toFixed(0)
    }
    console.log("the code ", code)
    return (
        <div className="partner-promo">
            <div className="summary shadows">
                {
                    loading ? <> <Skel variant="rectangular" heigth={50} /> <Skel variant="rectangular" heigth={50} /><Skel variant="rectangular" heigth={50} /></>
                        : <>
                            <h2>Informations</h2>
                            <div className="details">
                                <div className="info">
                                    <span><b>Code promo &ensp;:&ensp; &ensp; {code.code.code} </b></span>
                                    <span>Nom &ensp;:&ensp; &ensp; {code.code.owner} </span>
                                    <span>Telephone &ensp;:&ensp; &ensp; {code.code.phone} </span>
                                    <span>Email &ensp;:&ensp; &ensp; {code.code.email} </span>
                                    <span>Pourcentage &ensp;:&ensp; &ensp; {code.code.percent}% </span>
                                    <span>Utilisation &ensp;:&ensp; &ensp; {code.txs.length} transactions </span>
                                </div>
                                <div className="gain">
                                    <div className="">{calculGains()} XAF</div>
                                    <div>de gains</div>
                                </div>
                            </div>
                        </>
                }
            </div>
            <div className="transactions shadows">
                <h2>Liste des transactions</h2>
                <div className="tx-row title">
                    <div>Date</div>
                    <div>Identifiant</div>
                    <div>Montant</div>
                    <div>Operation</div>
                    <div>Statut</div>
                </div>
                <div className="transactions-list">
                    {
                        loading ? <><Skel variant="rectangular" heigth={250} /></> : (
                            code.txs ? code.txs.map((item, i) => <TransactionRow key={`tx-${i}`} data={item} />) : <center><br /><h2>Une erreur est survenu</h2></center>
                        )
                    }
                </div>
            </div>
        </div>
    )
}

export default Promo

const TransactionRow = ({ data }) => {

    return (
        <div className="tx-row">
            <div><b>{dateFormat(data.created_at, "hh:MM")}</b></div>
            <div>{data.transaction_id}</div>
            <div>{data.amount} XAF</div>
            <div>{"Buy crypto"}</div>
            <div>{data.completed ? 'SUCCES' : 'ECHEC'}</div>
        </div>
    )
}

const Code = {
    active: true,
    created_at: 1665206841708,
    email: "djounda@ipercash.fr",
    owner: "folley kako II",
    parrain_id: "parrain-001",
    percent: 1,
    phone: "651851676",
    updated_at: 1665206841708,
    usage: 3
}
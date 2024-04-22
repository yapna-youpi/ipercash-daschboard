import React, { useState, useEffect } from 'react'
import dateFormat from 'dateformat'
import { FaRegCopy } from 'react-icons/fa'

import { useAuth } from '../../context/auth'
import { getToApi } from '../../../functions/utilsFunctions'
import { toastify } from '../../shared/toast/Toast'


import './sponsor.css'
import Skel from '../../shared/skeleton/Skel'

function Sponsor() {
    let { user } = useAuth()
    const [sponsor, setSponsor] = useState({ sponsor: {}, txs: [], users: [] })
    const [loading, setLoading] = useState(true)
    useEffect(() => {
        getCode()
    }, [])

    const getCode = async () => {
        setLoading(true)
        let parrain_id = user.role.split('_')[2]
        let response = await getToApi('parrain/getone/:' + parrain_id, false)
        if (!response) {
            setSponsor({ sponsor: null, txs: null, users: null })
            return setLoading(false)
        }
        let { transactions } = await getToApi('parrain/parrainusage/:' + response.parrain.parrain_id, false)
        let { users } = await getToApi('parrain/usersofparrain/:' + response.parrain.parrain_id, false)
        setSponsor({ sponsor: response.parrain, txs: transactions, users })
        setLoading(false)
    }

    const calculGains = () => {
        let amount = 0
        if (!sponsor.txs) return 0
        sponsor.txs.map(item => amount += item.amount)
        return (amount * sponsor.sponsor.percent / 100).toFixed(0)
    }

    const copy = () => {
        navigator.clipboard.writeText(`https://ipercash.io/signup/${sponsor.sponsor.parrain_id}`)
        toastify('info', 'copied', 2000)
    }

    console.log("the sponsor ", sponsor)
    return (
        <div className="partner-sponsor">
            <div className="summary shadows">
                {
                    loading ? <> <Skel variant="rectangular" heigth={50} /> <Skel variant="rectangular" heigth={50} /><Skel variant="rectangular" heigth={50} /></>
                        : <>
                            <h2>Informations</h2>
                            <div className="details">
                                <div className="info">
                                    <span><b>Lien de parrainnage &ensp;:&ensp; &ensp; https://ipercash.io/signup/{sponsor.sponsor.parrain_id} <FaRegCopy color='#cc1616' size={20} onClick={copy} /></b></span>
                                    <span>Nom &ensp;:&ensp; &ensp; {sponsor.sponsor.owner} </span>
                                    <span>Telephone &ensp;:&ensp; &ensp; {sponsor.sponsor.phone} </span>
                                    <span>Email &ensp;:&ensp; &ensp; {sponsor.sponsor.email} </span>
                                    <span>Pourcentage &ensp;:&ensp; &ensp; {sponsor.sponsor.percent}% </span>
                                    <span>Utilisateurs &ensp;:&ensp; &ensp; {sponsor.users.length} utilisateurs </span>
                                    <span>Utilisation &ensp;:&ensp; &ensp; {sponsor.txs.length} transactions </span>
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
                            sponsor.txs ? sponsor.txs.map((item, i) => <TransactionRow key={`tx-${i}`} data={item} />) : <center><br /><h2>Une erreur est survenu</h2></center>
                        )
                    }
                </div>
            </div>
            <div className="usr shadows">
                <h2>Liste des Utilisateurs</h2>
                <div className="users-list">
                    {
                        loading ? <><Skel variant="rectangular" heigth={250} /></>
                            : sponsor.users.map((user, i) => <UserRow key={`user-${i}`} data={user} />)
                    }
                </div>
            </div>
        </div>
    )
}

export default Sponsor

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

const UserRow = ({ data }) => {

    return (
        <div className="user-row">
            <div>{data.email}</div>
            <div>{data.name}</div>
            <div>{data.phone}</div>
            <div>{data.country.split('_')[0]}</div>
            <div>{data.active ? "Actif" : "Inactif"}</div>
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

const Users = [
    { _id: '634135115b3a64b82d67c116', name: 'Parrained', email: 'parained@test.com', password: '$2b$10$WN21wucy3MJ5/CT5qxMxPeyehhv5Ca5qkSZA25OfWgC2xFCENvcqO', phone: '+33123456789' },
    { _id: '6341db6e5c74463a63002de0', name: 'willer', email: 'yapna@gmail.com', password: '$2b$10$EWyIELSmmI.cHVBO7uk61usIuH9GUynl8HRD.2tSDj/wZfM9tptfG', phone: '+237677777777' },
    { _id: '6343170deb72100185710d64', name: 'AMBASSA', email: 'robertocarlosdosantos9@gmail.com', password: '$2b$10$I7Vb2aNEq9ztWUx.MXF5KeIE1nGNxgnu.sgLALQ4EY43ypht25Lu.', phone: '+237697510827' },
    { _id: '6343182beb72100185710d6c', name: 'AMBASSA', email: 'ambassarobertosantos@gmail.com', password: '$2b$10$vAKUQp7sSxpCb45es3YzzeCJDtzgs.z7XhvVuvrTO67itzugiwL0a', phone: '+237697510827' }
]
import React, { useState, useEffect } from 'react'
import dateFormat from 'dateformat'

import { getToApi } from '../../functions/utilsFunctions'

import './sponsordetails.css'

function SponsorDetails({ location }) {
    let { sponsor, users } = location.state
    const [txs, setTxs] = useState([])
    useEffect(() => {
        getTx()
    }, [])


    const getTx = async () => {
        let tx = await getToApi('parrain/parrainusage/:' + sponsor.parrain_id, false)
        if (!tx) return setTxs(null)
        // console.log("the transactions ", tx.transactions)
        setTxs(tx.transactions)
    }
    const calculGains = () => {
        let amount = 0
        if (!txs) return 0
        txs.map(item => amount += item.amount)
        return (amount * sponsor.percent / 100).toFixed(0)
    }
    // console.log("the props ", location.state)

    return (
        <div className="sponsor-details">
            <div className="summary shadows">
                <h2>Informations sur le parrain</h2>
                <div className="details">
                    <div className="info">
                        <span><b> Code Parrain &ensp;:&ensp; &ensp; {sponsor.parrain_id} </b></span>
                        <span>Nom &ensp;:&ensp; &ensp; {sponsor.owner} </span>
                        <span>Telephone &ensp;:&ensp; &ensp; {sponsor.phone} </span>
                        <span>Email &ensp;:&ensp; &ensp; {sponsor.email} </span>
                        <span>Pourcentage &ensp;:&ensp; &ensp; {sponsor.percent}% </span>
                        <span>Utilisateurs &ensp;:&ensp; &ensp; {users.length} utilisateurs </span>
                        <span>Utilisation &ensp;:&ensp; &ensp; {sponsor.usage} transactions </span>
                    </div>
                    <div className="gain">
                        <div className="">{calculGains()} XAF</div>
                        <div>de redevances</div>
                    </div>
                </div>
            </div>
            <div className="transactions">
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
                        txs ? txs.map((item, i) => <TransactionRow key={`tx-${i}`} data={item} />) : <center><br /><h2>Une erreur est survenu</h2></center>
                    }
                </div>
            </div>
            <div className="usr">
                <h2>Liste des Utilisateurs</h2>
                <div className="users-list">
                    {
                        users.map((user, i) => <UserRow key={`user-${i}`} data={user} />)
                    }
                </div>
            </div>
        </div>
    )
}

export default SponsorDetails

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
            <div>{data.country.split('_')[1]}</div>
            <div>{data.active ? "Actif" : "Inactif"}</div>
        </div>
    )
}

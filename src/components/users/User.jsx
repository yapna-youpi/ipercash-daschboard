import React, { useEffect, useState } from 'react'
import dateFormat from 'dateformat'
import 'react-responsive-modal/styles.css'

import './user-details.css'
import profil from '../../assets/images/logo.png'
import Skel from '../shared/skeleton/Skel'
import { useHistory } from 'react-router-dom'
import { euro, getCountry, getToApi, periods, round } from '../../functions/utilsFunctions'
import Period from '../shared/time/Date'

function User({ location }) {
    const [transactions, setTransactions] = useState([])
    const [period, setPeriod] = useState(periods.month)
    const [loading, setLoading] = useState(false)
    const user = location.state
    useEffect(() => {
        getTransactions()
        return () => {
        }
    }, [])

    const getTransactions = async () => {
        const response = await getToApi('getusertxs/' + user.id)
        if (!response.error) {
            // console.log("the txs ", response.txs)
            response.txs.sort((a, b) => a.created_at < b.created_at ? 1 : -1)
            setTransactions(response.txs || [])
        }
    }
    const showedTransaction = () => transactions.filter(item => item.created_at > period)
    const successfullOperations = () => transactions.filter(item => item.status == "complete")
    const extraBusinessAmount = () => {
        let amount = 0
        successfullOperations().map(item => amount += item.amountFiat)
        return amount
    }
    // console.log("the user ", location)
    return (
        <div className="user-details">
            <div className="user shadows">
                <div className="identity">
                    <div className="">
                        <div className="user-info">
                            <span>Nom : </span>
                            <span>{user.name}</span>
                        </div>
                        <div className="user-info">
                            <span>Email : </span>
                            <span>{user.email}</span>
                        </div>
                        <div className="user-info">
                            <span>Telephone : </span>
                            <span>{user.phone}</span>
                        </div>
                        <div className="user-info">
                            <span>Pays : </span>
                            <span>{user.country.split('_')[0]}</span>
                        </div>
                        <div className="user-info">
                            <span>Date d'inscription : </span>
                            <span>{dateFormat(user.created_at, "dddd, d mmmm, yyyy")}</span>
                        </div>
                        <div className="user-info">
                            <span>Compte Activé : </span>
                            <span>{user.active ? "Oui" : "Non"}</span>
                        </div>
                    </div>
                    <img src={profil} alt="" />
                </div>
                {loading ? (<>
                    <><Skel variant="rectangular" heigth={50} /> <Skel variant="rectangular" heigth={50} /> <Skel variant="rectangular" heigth={50} /></>
                </>) : (
                    <div className="rates">
                        <div className="rate">
                            <span>Transactions tentées</span>
                            <span>{transactions.length}</span>
                        </div>
                        <div className="rate">
                            <span>Transactions Reussies</span>
                            <span>{successfullOperations().length}</span>
                        </div>
                        <div className="rate">
                            <span>Chiffre D'affaire</span>
                            <span>{extraBusinessAmount()} XAF</span>
                            <span>{round(2, extraBusinessAmount() / euro)} €</span>
                        </div>
                    </div>)
                }
            </div>
            <div className="transactions">
                <div className="head">
                    <h3>Transactions List &emsp;</h3>
                    <span>Transactions à afficher : </span>
                    <div className="time"><Period change={setPeriod} start="Mensuelle" /></div>
                </div>
                <div className="transaction-min title">
                    <div>Date</div>
                    <div>TransactionId</div>
                    <div>Crypto</div>
                    <div>Montant</div>
                    <div>Numero</div>
                    <div>Provider</div>
                    <div>Pays</div>
                    <div>Statut</div>
                    {/* <div>Paiement</div> */}
                </div>
                {loading ? (<>
                    <><Skel variant="rectangular" heigth={50} /> <Skel variant="rectangular" heigth={50} /> <Skel variant="rectangular" heigth={50} /></>
                </>) : (<div className='tx-list' >{
                    showedTransaction().map((tx, i) => <Transaction data={tx} key={`tx${i}`} />)
                }</div>)
                }
            </div>
        </div>
    )
}



const Transaction = ({ data }) => {
    const history = useHistory()
    return (
        <div className="transaction-min">
            <div><b>{dateFormat(data.created_at, "dd-mm-yyyy, HH:MM")}</b></div>
            <div className='tx-id' onClick={() => history.push('/transaction/:' + data.transaction_id)} >{data.transaction_id}</div>
            <div>{data.cryptoCurency}</div>
            <div>{round(2, data.amountFiat / euro)}&euro; / {data.amountFiat} XAF</div>
            <div>{data.phone}</div>
            <div>{data.provider}</div>
            <div>{getCountry(data.phone)}</div>
            <div>{data.status}</div>
        </div>
    )
}

export default User
import React, { useState, useEffect } from 'react'
import ReactLoading from 'react-loading'
import dateFormat from 'dateformat'
import { useHistory } from 'react-router-dom'

import Period from '../shared/time/Date'

import './send.css'
import { getToApi, getCountry, defaultPeriod, round } from '../../functions/utilsFunctions'

let interval = null

function Send() {
    const [loading, setLoading] = useState(true)
    const [transactions, setTransactions] = useState({ txs: [], cm: 0, ci: 0, sn: 0 })
    const [result, setResult] = useState({ mercuryo: 0, bch: 0, intouch: 0, fee: 0, mg: 0 })
    useEffect(() => {
        getTransactions().then(() => {
            setLoading(false)
        })
        interval = setInterval(() => {
            // console.log("get interval")
            getTransactions()
        }, 90 * 1000)
        return () => {
            // console.log("the intervale ", interval)
            clearInterval(interval)
        }
    }, [])

    const getTransactions = async (period = defaultPeriod) => {
        let send = await getToApi('getsendbydate/:' + period)
        // console.log("the send ", send)
        setTransactions({ ...transactions, txs: send })
        calculMarge(send)
    }
    const calculMarge = (txs) => {
        let ctxs = [], mercuryo = 0, bch = 0, intouch = 0, fee = 0 // completd transactions table
        txs.forEach((tx) => {
            if (tx.status === 'completed') {
                ctxs.push(tx)
                mercuryo += tx.mercuryo
                bch += tx.bch
                intouch += tx.amount
                fee += 250
            }
        })
        if (ctxs.length) {
            // console.log("continue")
            setResult({ ...result, mercuryo, bch, intouch, fee, mg: (bch * 655 - intouch - fee) })
        }
        else setResult({ mercuryo: 0, bch: 0, intouch: 0, fee: 0, mg: 0 })

    }
    const setPeriod = (period) => {
        setLoading(true)
        getTransactions(period).then(() => {
            // setResult()
            setLoading(false)
        })
        console.log("the intervalle", interval)
        clearInterval(interval)
        interval=setInterval(() => {
            console.log("second")
            getTransactions(period)
        }, 90 * 1000)
    }

    console.log("the transactions ", transactions)
    return (
        <div className='send'>
            {/* <h1>Send</h1> */}
            <div className="transaction" >
                <div className="transactions shadows">
                    <div className="head">
                        <h3>Liste des transactions</h3> &emsp;
                        <span>Transactions a afficher : </span>
                        <div className="time"><Period change={setPeriod} /></div>
                    </div>
                    <div className="transaction-min title">
                        <div>Date</div>
                        <div>TransactionId</div>
                        <div>Montant</div>
                        <div>Mobile Money</div>
                        <div>Statut</div>
                        <div>Code Pays</div>
                        {/* <div>12:00</div> */}
                        <div>Paiement</div>
                        {/* <div>SEND</div> */}
                    </div>/
                    {loading ? (<>
                        <div className="loader"><ReactLoading type="spin" color='#CC1616' height={150} width={150} /></div>
                    </>) : (<>{
                        transactions.txs.map((tx, i) => <Transaction data={tx} key={`tx${i}`} />)
                    }</>)
                    }
                </div>
            </div>
            <div className="asses">
                <h1>Bilan de la periode</h1>
                {
                    loading ? (<div className="loader"><ReactLoading type="spin" color='#CC1616' height={150} width={150} /></div>) :
                        (<>
                            <div className="assests">
                                <div className="assest">
                                    <div className="amount" style={{ backgroundColor: '#5735fe' }}>
                                        <h2>{round(2, result.mercuryo)}&euro;</h2>
                                        <h4>{round(2, result.mercuryo * 655)} XAF</h4>
                                    </div>
                                    <p>de payements effectues chez Mercuryo</p>
                                </div>
                                <div className="assest">
                                    <div className="amount" style={{ backgroundColor: '#3bb28e' }}>
                                        <h2>{round(2, result.bch)}&euro;</h2>
                                        <h4>{round(2, result.bch * 655)} XAF</h4>
                                    </div>
                                    <p>de BCH recu de chez Mercuryo</p>
                                </div>
                                <div className="assest">
                                    <div className="amount" style={{ backgroundColor: '#cc1616' }}>
                                        <h2>{round(2, result.intouch / 655)}&euro;</h2>
                                        <h4>{round(2, result.intouch)} XAF</h4>
                                    </div>
                                    <p>De transferts effectues par intouch</p>
                                </div>
                                <div className="assest">
                                    <div className="amount" style={{ backgroundColor: '#038cf4' }}>
                                        <h2>{round(2, result.fee / 655)}&euro;</h2>
                                        <h4>{result.fee} XAF</h4>
                                    </div>
                                    <p>De frais intouch</p>
                                </div>
                            </div>
                            <div className="bar"></div>
                            <Marge mg={result.mg} />
                        </>)
                }
            </div>
        </div>
    )
}

const Transaction = ({ data }) => {
    const history=useHistory()
    return (
        <div className="transaction-min">
            <div><b>{dateFormat(data.created_at, "dd-mm-yyyy, HH:MM")}</b></div>
            <div className='tx-id' onClick={()=>history.push('/transaction/:'+data.id)} >{data.id}</div>
            {/* <div>{data.id}</div> */}
            <div>{Math.round(data.mercuryo /655.77)}&euro; / {data.amount} XAF</div>
            <div>{data.phone}</div>
            <div>{data.status}</div>
            <div>{getCountry(data.phone)}</div>
            <div>{data.payment ? 'true' : 'false'}</div>
            {/* <div>SEND</div> */}
        </div>
    )
}

const Marge = ({ mg }) => {
    return (
        <div className="bilan">
            <div className="">La marge realisee est de : </div>

            {
                mg >= 0 ? <div className=""> {round(2, mg / 655)} &euro; / {round(2, mg)} XAF </div>
                    : <div className="red-marge"> {round(2, mg / 655)} &euro; / {round(2, mg)} XAF </div>
            }
        </div>
    )
}


export default Send
import React, { useState, useEffect } from 'react'
import ReactLoading from 'react-loading'
import dateFormat from 'dateformat'

import Period from '../shared/time/Date'

import './buy.css'
import { getToApi, getCountry, defaultPeriod, round, euro, periods } from '../../functions/utilsFunctions'
import { useHistory } from 'react-router-dom'
import BuyChart from './BuyChart'

let interval = null
const INTOUCH_FEE = 0.025

function Buy() {
    const [loading, setLoading] = useState(true)
    const [bareTransactions, setBareTransactions] = useState([])
    const [transactions, setTransactions] = useState({ txs: [], cm: 0, ci: 0, sn: 0 })
    const [result, setResult] = useState({ btc: 0, intouch: 0, fee: 0, mg: 0 })
    const [filters, setFilter] = useState({ period: defaultPeriod, success: false })
    useEffect(() => {
        getBareData().then(data => {
            getData(data, filters)
            setBareTransactions(data)
            setLoading(false)
        })

        interval = setInterval(() => {
            getBareData().then(data => {
                setBareTransactions(data)
            })
        }, 300 * 1000)
        return () => {
            clearInterval(interval)
        }
    }, [])
    const getBareData = async () => {
        return await getToApi('getbuybydate/:' + periods.all)
    }
    const getData = (data, filters) => {
        let periodData = data.filter(item => item.created_at >= filters.period)
        /*
            put all the filter operations here
        */
        if (filters.success) periodData = periodData.filter(item => item.status == "complete")
        setTransactions({ ...transactions, txs: periodData })
        calculMarge(periodData)
    }
    const calculMarge = (txs) => {
        let ctxs = [] // completd transactions table
        txs.forEach((tx) => {
            if (tx.status === 'complete') ctxs.push(tx)
        })
        if (ctxs.length) {
            let btc = 0, intouch = 0, fee = 0
            ctxs.forEach((item) => {
                btc += item.crypto
                intouch += item.amount
                fee += item.amount * INTOUCH_FEE
            })
            // console.log("les montants ", btc, intouch)
            setResult({ btc: btc, intouch: intouch, fee: fee, mg: intouch - btc - fee })
        }
        else setResult({ btc: 0, intouch: 0, fee: 0, mg: 0 })
    }

    const setPeriod = (period) => {
        setLoading(true)
        const newFilters = { ...filters, period }
        getData(bareTransactions, newFilters)
        setFilter({ ...filters, period })
        setLoading(false)
        clearInterval(interval)
        interval = setInterval(() => {
            getData(bareTransactions, period)
        }, 300 * 1000)
    }
    const changeData = (name, value) => {
        const newFilters = { ...filters, [name]: value }
        getData(bareTransactions, newFilters)
        setFilter(newFilters)
    }

    return (
        <div className='buy'>
            {/* <h1>Send</h1> */}
            <div className="transaction" >
                <div className="transactions shadows">
                    <div className="head">
                        <h3>Transactions List</h3>
                        <span>Transactions a afficher : </span>
                        <div className="time"><Period change={setPeriod} start="Mensuelle" /></div>
                        <div className="">
                            &emsp;<input type="checkbox" id='success-filter' checked={filters.success}
                                onClick={() => changeData('success', !filters.success)}
                            />
                            <label htmlFor="sucess-filter">Transactions reussies uniquement</label>
                        </div>
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
                        <div className="loader"><ReactLoading type="spin" color='#CC1616' height={150} width={150} /></div>
                    </>) : (<div className='tx-list' >{
                        transactions.txs.map((tx, i) => <Transaction data={tx} key={`tx${i}`} />)
                    }</div>)
                    }
                </div>
            </div>
            <div className="asses">
                {
                    !loading ? (
                        <>
                            <h1>Bilan de la periode</h1>
                            <div className="assests">
                                <div className="assest">
                                    <div className="amount" style={{ backgroundColor: '#cc1616' }}>
                                        <h2>{round(2, result.intouch / euro)}&euro;</h2>
                                        <h4>{result.intouch} XAF</h4>
                                    </div>
                                    <p>D'encaissements effectues par intouch</p>
                                </div>
                                <div className="assest">
                                    <div className="amount" style={{ backgroundColor: '#038cf4' }}>
                                        <h2>{round(2, result.fee / euro)}&euro;</h2>
                                        <h4>{result.fee} XAF</h4>
                                    </div>
                                    <p>De frais intouch</p>
                                </div>
                                <div className="assest">
                                    <div className="amount" style={{ backgroundColor: '#f18e1b' }}>
                                        <h2>{round(2, result.btc / euro)}&euro;</h2>
                                        <h4>{result.btc} XAF</h4>
                                    </div>
                                    <p>De Bitcoin envoyes</p>
                                </div>
                            </div>
                            <div className="bar"></div>
                            <Marge mg={result.mg} />
                        </>
                    ) : (<div className="loader"><ReactLoading type="spin" color='#CC1616' height={100} width={100} /></div>)
                }
            </div>
            <div className="chart">
                <BuyChart operations={transactions.txs} />
            </div>
        </div>
    )
}

const Transaction = ({ data }) => {
    const history = useHistory()
    return (
        <div className="transaction-min">
            <div><b>{dateFormat(data.created_at, "dd-mm-yyyy, HH:MM")}</b></div>
            <div className='tx-id' onClick={() => history.push('/transaction/:' + data.id)} >{data.id}</div>
            <div>{data.cryptoCurency}</div>
            <div>{round(2, data.amount / euro)}&euro; / {data.amount} XAF</div>
            <div>{data.phone}</div>
            <div>{data.provider}</div>
            <div>{getCountry(data.phone)}</div>
            <div>{data.status}</div>
            {/* <div>{data.payment}</div> */}
            {/* <div>SEND</div> */}
        </div>
    )
}

const Marge = ({ mg }) => {
    return (
        <div className="bilan">
            <div className="">La marge realisee est de : </div>
            {
                mg >= 0 ? <div className=""> {round(2, mg / euro)} &euro; / {mg} XAF </div>
                    : <div className="red-marge"> {round(2, mg / euro)} &euro; / {mg} XAF </div>
            }
        </div>
    )
}

export default Buy
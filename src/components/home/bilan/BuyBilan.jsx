import React, { useState, useEffect } from 'react'
import Skeleton from '@mui/material/Skeleton'

import { getToApi, defaultPeriod, round, euro } from '../../../functions/utilsFunctions'

let interval = null
const INTOUCH_FEE = 0.025

function BuyBilan() {
    const [loading, setLoading] = useState(true)
    const [transactions, setTransactions] = useState({ txs: [], cm: 0, ci: 0, sn: 0 })
    const [result, setResult] = useState({ btc: 0, intouch: 0, fee: 0, mg: 0 })
    useEffect(() => {
        getTransactions().then(() => {
            // setResult()
            setLoading(false)
        })
        interval = setInterval(() => {
            // console.log("get interval")
            getTransactions()
        }, 600 * 1000)
        return () => {
            // console.log("the intervale ", interval)
            clearInterval(interval)
        }
    }, [])

    const getTransactions = async (period = defaultPeriod) => {
        let buy = await getToApi('getbuybydate/:' + period)
        // console.log("the buy ", buy)
        setTransactions({ ...transactions, txs: buy })
        calculMarge(buy)
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

    return (
        <div className='buy'>
            <div className="asses">
                {!loading ? (
                    <>
                        <h1>Bilan de la vente de crypto</h1>
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
                        <center><h3>{ transactions.txs.length } Transactions initiees</h3></center>
                        <div className="bar"></div>
                        <Marge mg={result.mg} />
                    </>
                ) : (<Skel variant="rectangular" heigth={200} />)}
            </div>
        </div>
    )
}

const Marge = ({ mg }) => {
    return (
        <div className="bilan">
            <div className="">La marge realisee est de : </div>
            <div className=""> {round(2, mg / euro)} &euro; / {mg} XAF </div>
        </div>
    )
}

const Skel = ({ variant, width = null, heigth = 30 }) => <Skeleton animation="wave" variant={variant} height={heigth} width={width} />


export default BuyBilan
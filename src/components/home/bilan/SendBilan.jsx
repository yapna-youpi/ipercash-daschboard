import React, { useState, useEffect } from 'react'
import ReactLoading from 'react-loading'
import Skeleton from '@mui/material/Skeleton'

// import Period from '../shared/time/Date'

import { getToApi, defaultPeriod, round } from '../../../functions/utilsFunctions'

let interval=null

function SendBilan() {
    const [loading, setLoading]=useState(true)
    const [transactions, setTransactions]=useState({txs: [], cm:0, ci:0, sn:0})
    const [result, setResult]=useState({ mercuryo: 0, bch: 0, intouch: 0, fee: 0, mg: 0 })
    useEffect(()=>{
        getTransactions().then(()=>{
            setLoading(false)
        })
        interval=setInterval(() => {
            // console.log("get interval")
            getTransactions()
        }, 600*1000)
        return ()=>{
            // console.log("the intervale ", interval)
            clearInterval(interval)
        }
    }, [])

    const getTransactions=async(period=defaultPeriod)=>{
        let send=await getToApi('getsendbydate/:'+period)
        // console.log("the send ", send)
        setTransactions({...transactions, txs: send})
        calculMarge(send)
    }
    const calculMarge=(txs)=>{
        let ctxs=[], mercuryo=0, bch=0, intouch=0, fee=0 // completd transactions table
        txs.forEach((tx)=>{
            if(tx.status==='completed') {
                ctxs.push(tx)
                mercuryo+=tx.mercuryo
                bch+=tx.bch
                intouch+=tx.amount
                fee+=250
            }
        })
        if(ctxs.length) {
            // console.log("continue")
            setResult({...result, mercuryo, bch, intouch, fee, mg: (bch*655-intouch-fee)})
        }
        else  setResult({ mercuryo: 0, bch: 0, intouch: 0, fee:0, mg: 0 })

    }
    const setPeriod=(period)=>{
        setLoading(true)
        getTransactions(period).then(()=>{
            // setResult()
            setLoading(false)
        })
    }

    // console.log("the transactions ", result)
	return (
		<div className='send'>
            <div className="asses">
                <h1>Bilan du transfert</h1>
                {
                    loading ? (<Skel variant="rectangular" heigth={200} />):
                    (<>
                        <div className="assests">
                            <div className="assest">
                                <div className="amount"  style={{backgroundColor: '#5735fe'}}>
                                    <h2>{round(2, result.mercuryo)}&euro;</h2>
                                    <h4>{round(2, result.mercuryo*655)} XAF</h4>
                                </div>
                                <p>de payements effectues chez Mercuryo</p>
                            </div>
                            <div className="assest">
                                <div className="amount"  style={{backgroundColor: '#3bb28e'}}>
                                    <h2>{round(2, result.bch)}&euro;</h2>
                                    <h4>{round(2, result.bch*655)} XAF</h4>
                                </div>
                                <p>de BCH recu de chez Mercuryo</p>
                            </div>
                            <div className="assest">
                                <div className="amount"  style={{backgroundColor: '#cc1616'}}>
                                    <h2>{round(2, result.intouch/655)}&euro;</h2>
                                    <h4>{round(2, result.intouch)} XAF</h4>
                                </div>
                                <p>De transferts effectues par intouch</p>
                            </div>
                            <div className="assest">
                                <div className="amount"  style={{backgroundColor: '#038cf4'}}>
                                    <h2>{round(2, result.fee/655)}&euro;</h2>
                                    <h4>{result.fee} XAF</h4>
                                </div>
                                <p>De frais intouch</p>
                            </div>
                        </div>
                        <center><h3>{ transactions.txs.length } Transactions initiees</h3></center>
                        <div className="bar"></div>
                        <Marge mg={result.mg} />
                    </>)
                }
            </div>
		</div>
	)
}


const Marge=({mg})=>{
    return (
        <div className="bilan">
            <div className="">La marge realisee est de : </div>
            <div className=""> {round(2, mg/655)} &euro; / {round(2, mg)} XAF </div>
        </div>
    )
}

const Skel = ({ variant, width = null, heigth = 30 }) => <Skeleton animation="wave" variant={variant} height={heigth} width={width} />


export default SendBilan
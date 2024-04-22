import React, { useState, useEffect } from 'react'
import Skeleton from '@mui/material/Skeleton'
import dateFormat from 'dateformat'

import { getToApi } from '../../functions/utilsFunctions'

import PieChart from './PieChart'
import { getCountryCount } from './functions'
import { useHistory } from 'react-router-dom'

function Transactions() {
    const [transactions, setTransactions] = useState({ txs: [], cm: 0, ci: 0, sn: 0 })
    const [loading, setLoading] = useState(true)
    useEffect(() => {
        getTransactions()
    }, [])

    const getTransactions = async () => {
        let send = await getToApi('getsendbydate/:' + (+new Date() - 604800000))  // 86400000
        let buy = await getToApi('getbuybydate/:' + (+new Date() - 604800000))
        let sell = await getToApi('getsellbydate/:' + (+new Date() - 604800000))  // 604800000
        let count = getCountryCount([...send, ...buy, ...sell])
        setTransactions({ txs: [...send, ...buy, ...sell], ...count })
        setLoading(false)
    }

    return (
        <div className="transaction">
            <div className="transactions">
                {loading ? (<Skel variant="rectangular" heigth={500} />) : (<>
                    <h3>Transactions Of Day</h3>
                    <div className="transactions-list">
                        {!transactions.txs.length && (<h2>Encore aucune transaction effectuee aujourd'hui</h2>)}
                        {transactions.txs.map((item, i) => <TransactionMin data={item} ind={i} key={`tx-${i}`} />)}
                    </div>
                </>)}
            </div>
            <div className="chart">
                {loading ? (<Skel variant='circular' width={250} heigth={250} />)
                    : (transactions.txs.length ? <PieChart count={getCountryCount(transactions.txs)} /> : <h2>Rien a afficher ici</h2> )
                }
                {loading ? (<>
                    <Skel variant='text' />
                    <Skel variant='text' />
                    <Skel variant='text' />
                </>) : (<>
                    <Country name="Cameroun" color="#cc161693" count={transactions.cm} />
                    <Country name="Senegal" color="#2ecc71" count={transactions.sn} />
                    <Country name="Cote d'Ivoire" color="#ff6738" count={transactions.ci} />
                </>)}
            </div>
        </div>
    )
}

export default Transactions

const Skel = ({ variant, width = null, heigth = 30 }) => <Skeleton animation="wave" variant={variant} height={heigth} width={width} />

function TransactionMin({ data }) {
    const history=useHistory()
    return (
        <div className="transaction-min">
            <div><b>{dateFormat(data.created_at, "HH:MM")}</b></div>
            <div className='tx-id' onClick={()=>history.push('/transaction/:'+data.id)} >{data.id}</div>
            <div>{data.amount} XAF</div>
            <div>{data.status.toUpperCase()}</div>
            <div>{data.type}</div>
        </div>

    )
}

const Country = ({ name, color, count }) => {
    return (
        <div className='country'>
            <div className="color"></div>
            <h3>{name} : {count} Transactions</h3>
        </div>
    )
}
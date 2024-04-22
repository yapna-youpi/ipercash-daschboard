import React, { useState, useEffect } from 'react'
import Skeleton from '@mui/material/Skeleton'
// import { FaCheckSquare } from 'react-icons/fa'
import { BsCheckSquareFill } from 'react-icons/bs'

import Period from '../shared/time/Date'

import './statement.css'
import { getToApi, defaultPeriod, round, periods } from '../../functions/utilsFunctions'
import StatementGraph from './StatementGraph'

function Statement() {
	const [loading, setLoading] = useState(true)
	const [bareOperations, setBareOperations] = useState({ send: [], buy: [], sell: [] })
	// const [operations, setOperations] = useState({ send: [], buy: [], sell: [] })
	const [statement, setStatement] = useState({ send: { ch: 0, mg: 0 }, buy: { ch: 0, mg: 0 }, sell: { ch: 0, mg: 0 } })
	// const [transactions, setTransactions]=useState({txs: [], cm:0, ci:0, sn:0})
	useEffect(() => {
		getBareData().then((data) => {
			// console.log("the bare operations", data)
			getData(data, defaultPeriod)
			setBareOperations(data);
			setLoading(false);
		})

	}, [])

	const getTransactions = async (route, period = defaultPeriod) => {
		return await getToApi(route + period)
	}
	const getBareData = async () => {
		let sendTx = await getTransactions('getsendbydate/:', periods.all)
		let buyTx = await getTransactions('getbuybydate/:', periods.all)
		let sellTx = await getTransactions('getsellbydate/:', periods.all)
		return { send: sendTx, buy: buyTx, sell: sellTx }
	}
	const filterByDate = (data, period) => {
		return data.filter(item => item.created_at > period)
	}
	const getData = (data, period) => {
		console.log("the operations ", data)
		let sendTx = filterByDate(data.send, period)
		let send = parseSend(sendTx)
		let buyTx = filterByDate(data.buy, period)
		let buy = parseBuy(buyTx)
		let sellTx = filterByDate(data.sell, period)
		let sell = parseSell(sellTx)
		// setOperations({ send: sendTx, buy: buyTx, sell: sellTx })
		setStatement({ send: send, buy: buy, sell: sell })
	}
	const setPeriod = (period) => {
		getData(bareOperations, period)
	}

	// console.log("the statement ", statement)

	return (
		<div className='statement'>
			<h1 className='shadows'> Periode du bilan : &ensp; <Period change={setPeriod} /> </h1>
			<div className="general shadows">
				<div className="items">
					<Item title="Transferts" color="#5735fe" data={statement.send} load={loading} />
					<div className="bar" />
					<Item title="Vente De Crypto" color="#f18e1b" data={statement.buy} load={loading} />
					<div className="bar" />
					<Item title="Rachat De Crypto" color="#cc1616" data={statement.sell} load={loading} />
				</div>
				<div className="vbar"></div>
				<div className="total">
					{
						loading ? (<>
							<div className="chiffre"><Skeleton animation="wave" variant="text" height={40} width={400} /></div>
							<div className="marge"><Skeleton animation="wave" variant="text" height={40} width={400} /></div>
						</>) : (<>
							<div className="chiffre"> <span>{round(2, calculCht(statement) / 655)}&euro;</span> de chiffre d'affaire </div>
							<div className="marge">
								<span style={{ color: calculMt(statement) < 0 ? '#cc1616' : 'inherit' }}>{round(2, calculMt(statement) / 655)}&euro;
								</span> de marge totale
							</div>
						</>)
					}
				</div>
			</div>
			<div className="graph shadows">
				<h2>Evolution de l'activité dans le temps</h2>
				{loading ? (
					<div className="chiffre"><Skeleton animation="wave" variant="text" height={200} width={400} /></div>
				) : <StatementGraph operations={bareOperations} />}
			</div>
		</div>
	)
}

const Item = ({ title, color, data, load }) => {
	// console.log("the data ", data)
	return (
		<>
			{load ? (<>
				<h2 className='operation' ><Skeleton animation="wave" variant="text" height={40} width={400} /></h2>
				<div className="item">
					<Skeleton animation="wave" variant="circular" height={150} width={150} />
					<div className="details">
						<div>
							<Skeleton animation="wave" variant="text" height={40} width={200} />
						</div>
						<div>
							<Skeleton animation="wave" variant="text" height={40} width={200} />
						</div>
						<div>
							<Skeleton animation="wave" variant="text" height={40} width={200} />
						</div>
					</div>
				</div>
			</>) :
				(<>
					<h2 className='operation' >{title}</h2>
					<div className="item">
						<div className="circle" style={{ borderColor: color, color: data.mg < 0 ? '#cc1616' : 'inherit' }}>
							<h2>{round(2, data.mg / 655)}&euro;</h2>
							<h4>{round(0, data.mg)} XAF</h4>
						</div>
						<div className="details">
							<div>
								<BsCheckSquareFill size={20} /> &ensp;
								{data.nbtx} Transactions initiees
							</div>
							<div>
								<BsCheckSquareFill size={20} /> &ensp;
								{data.nbc} Transactions abouties
							</div>
							<div>
								<BsCheckSquareFill size={20} /> &ensp;
								{round(2, data.ch / 655)}&euro; de chiffre d'affaire
							</div>
						</div>
					</div>
				</>)
			}
		</>
	)
}

const parseSend = (txs) => {
	let nb = 0, chi = 0, cho = 0
	txs.forEach((tx) => {
		if (tx.status === 'completed') {
			nb++
			chi += tx.bch * 655
			cho += tx.amount + 250

		}
	})
	return { nbtx: txs.length, nbc: nb, ch: chi, mg: chi - cho }
}
const parseBuy = (txs) => {
	let nb = 0, chi = 0, cho = 0
	txs.forEach((tx) => {
		if (tx.status === 'complete') {
			nb++
			chi += tx.amount
			cho += tx.crypto

		}
	})
	return { nbtx: txs.length, nbc: nb, ch: chi, mg: chi - cho }

}
const parseSell = (txs) => {
	let nb = 0, chi = 0, cho = 0
	txs.forEach((tx) => {
		if (tx.status === 'complete') {
			nb++
			cho += tx.amount
			chi += tx.crypto

		}
	})
	return { nbtx: txs.length, nbc: nb, ch: chi, mg: chi - cho }
}

const calculMt = ({ send, buy, sell }) => {
	return send.mg + buy.mg + sell.mg
}
const calculCht = ({ send, buy, sell }) => {
	return send.ch + buy.ch + sell.ch
}

export default Statement
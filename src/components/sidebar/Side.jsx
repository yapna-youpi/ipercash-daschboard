import React, { useState } from 'react'
import { useHistory } from 'react-router-dom'
import { RiApps2Fill } from 'react-icons/ri'
import { BsFillCreditCardFill, BsGear, BsGearWideConnected } from 'react-icons/bs'
import { FaBitcoin, FaMoneyBillWaveAlt, FaCoins, FaUsers } from 'react-icons/fa'
import { RiHandCoinFill } from 'react-icons/ri'
import { HiUserGroup } from 'react-icons/hi'

import { useAuth } from '../context/auth'

import './side.css'
import logo from '../../assets/images/logo.jpg'

function Side() {
	let { user } = useAuth()
	const [state, setState] = useState(document.location.pathname)
	const changeLink = (path) => setState(path)
	return (
		<div className="side">
			<div className="side-head">
				<img src={logo} alt="" />
				<h1>IPERCash</h1>
			</div>
			<div className="side-body">
				<ul>
					<NavLink label="Accueil" change={changeLink} route="/" active={state === '/'} >
						<RiApps2Fill color='#cc1616' />
					</NavLink>
					<NavLink label="Transfert" change={changeLink} route="/send" active={state === '/send'} >
						<BsFillCreditCardFill color='#cc1616' />
					</NavLink>
					<NavLink label="Vente De Crypto" change={changeLink} route="/buy" active={state === '/buy'} >
						<FaBitcoin color='#cc1616' />
					</NavLink>
					<NavLink label="Rachat De Crypto" change={changeLink} route="/sell" active={state === '/sell'} >
						<FaMoneyBillWaveAlt color='#cc1616' />
					</NavLink>
					<NavLink label="Bilan" change={changeLink} route="/statement" active={state === '/statement'} >
						<FaCoins color='#cc1616' />
					</NavLink>
					<NavLink label="Utilisateurs" change={changeLink} route="/users" active={state === '/users'} >
						<FaUsers color='#cc1616' />
					</NavLink>
					<NavLink label="Promo" change={changeLink} route="/promo" active={state === '/promo'} >
						<RiHandCoinFill color='#cc1616' />
					</NavLink>
					<NavLink label="Parrainage" change={changeLink} route="/sponsor" active={state === '/sponsor'} >
						<HiUserGroup color='#cc1616' />
					</NavLink>
					{
						user.role === "Administrateur" && <NavLink label="Administration" change={changeLink} route="/admin" active={state === '/admin'} >
							<BsGearWideConnected color='#cc1616' />
						</NavLink>
					}

				</ul>
			</div>
		</div>
	)
}

const NavLink = ({ label, children, active, route, change }) => {
	let history = useHistory()
	const nav = () => {
		history.push(route)
		change(route)
	}
	return (
		<li className={active ? "active" : ''} onClick={nav}
		>{children} <span>{label}</span> </li>
	)
}

export default Side
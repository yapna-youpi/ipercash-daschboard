import React from 'react'
import { useAuth } from '../context/auth'
import Promo from './promo/Promo'
import Sponsor from './sponsor/Sponsor'

function PartnerContent() {
	return (
		<div className="partner-content">
			<Navigator />
		</div>
	)
}

const Navigator = () => {
	let { user } = useAuth()
	return (
		<div className="">
			{
				user.role.includes('sponsor') ? <Sponsor /> : <Promo />
			}
		</div>
	)
}


export default PartnerContent
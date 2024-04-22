import React from 'react'
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom'

import Home from '../components/home/Home'
import Send from '../components/send/Send'
import Sell from '../components/sell/Sell'
import Buy from '../components/buy/Buy'
import Error from '../components/error/Error'
import Statement from '../components/statement/Statement'
import Notifs from '../components/notif/Notifs'
import Notif from '../components/notif/Notif'
import Admin from '../components/admin/Admin'
import { useAuth } from '../components/context/auth'
import Users from '../components/users/Users'
import Promo from '../components/promo/Promo'
import Sponsor from '../components/sponsor/Sponsor'
import SponsorDetails from '../components/sponsor/SponsorDetails'
import Transaction from '../components/transaction/TransactionDetails'
import User from '../components/users/User'

function Navigator() {
	return (
		<Switch>
			<Route path="/" exact component={Home} />
			<Route path="/transaction/:tid" exact component={Transaction} />
			<Route path="/users" exact component={Users} />
			<Route path="/user/:uid" exact component={User} />
			<Route path="/send" exact component={Send} />
			<Route path="/sell" exact component={Sell} />
			<Route path="/buy" exact component={Buy} />
			<Route path="/statement" exact component={Statement} />
			<Route path="/notifications" exact component={Notifs} />
			<Route path="/notification/:nid" exact component={Notif} />
			<Route path="/promo" exact component={Promo} />
			<Route path="/sponsor" exact component={Sponsor} />
			<Route path="/sponsor/details" exact component={SponsorDetails} />
			<AdminRoute path="/admin" exact><Admin /></AdminRoute>
			{/* <Route path="/admin" exact component={Admin} /> */}
			<Route path="/*" component={Error} />
		</Switch>
	)
}

const AdminRoute = ({ children, ...props }) => {
	let { user } = useAuth()
	// console.log("the user ", user)
	return (
		<Route {...props}
			render={() => user.role === "Administrateur" ? (
				children
			) : (
				<Redirect to={{
					pathname: "/",
					state: { from: '/' }
				}} />
			)
			}
		/>
	)
}


export default Navigator
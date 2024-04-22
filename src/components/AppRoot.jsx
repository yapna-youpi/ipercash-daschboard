import React from 'react';
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom';
import { Provider } from 'react-redux';

import { ProvideAuth, useAuth } from '../components/context/auth';
import store from '../store/store';

import './approot.css';
import ScrollToTop from './context/ScrollToTop';
import Side from './sidebar/Side';
import Header from './header/Header';
import Content from './content/Content';
import Login from './login/Login';
import Toast from './shared/toast/Toast';
import PartnerHeader from './partner/PartnerHeader';
import PartnerContent from './partner/PartnerContent';
import Forget from './forget/Forget';
import Reset from './reset/Reset';


function AppRoot() {
	return (
		<Provider store={store} >
			<ProvideAuth>
				<Router>
					<ScrollToTop />
					<Switch >
						<Route path="/login" exact component={Login} />
						<Route path="/forget" exact component={Forget} />
						<Route path="/reset/:id" exact component={Reset} />
						<ProtectedRoute path="/partner" exact >
							<Partner />
						</ProtectedRoute>
						<ProtectedRoute path="/" >
							<Dashboard />
						</ProtectedRoute>
					</Switch>
					<Toast />
				</Router>
			</ProvideAuth>
		</Provider>
	)
}
const Dashboard = () => {
	return (
		<div className="dashboard">
			<div className="side-bar box-shadows">
				<Side />
			</div>
			<div className="main-content">
				<div className="head">
					<Header />
				</div>
				<Content />
			</div>
		</div>
	)
}

const Partner = () => {
	return (
		<div className="partner">
			<div className="head">
				<PartnerHeader />
			</div>
			<PartnerContent />
		</div>
	)
}


const ProtectedRoute = ({ children, ...props }) => {
	let { user } = useAuth();
	// console.log("the rest ", props, user)
	return (
		<Route {...props}
			render={({ location }) => user ? (
				children
			) : (
				<Redirect to={{
					pathname: "/login",
					state: { from: location }
				}} />
			)
			}
		/>
	)
}

export default AppRoot
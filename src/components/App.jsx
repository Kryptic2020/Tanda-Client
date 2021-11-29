import React, {
	useState,
	useReducer,
	useEffect,
} from 'react';
import stateReducer from '../utils/stateReducer';
import { StateContext } from '../utils/stateContext';
import {
	BrowserRouter,
	Route,
	Switch,
	Redirect,
} from 'react-router-dom';
import NotFound from './NotFound';
import 'bootstrap/dist/css/bootstrap.min.css';

import './App.css';
import Nav from './NavigationBar';
import Login from './Login';
import Signup from './Signup';
import ForgotPass from './ForgotPass';
import ResetPass from './ResetPass';
import Dashboard from './Dashboard'
import EditOrganization from './EditOrganization'
import ShowOrganization from './ShowOrganization'
import Shift from './Shift'

function App() {
	const initialState = {
		userEmail:
			sessionStorage.getItem('email') || null,
		loggedInUser:
			sessionStorage.getItem('user') || null,
		auth: {
			token: sessionStorage.getItem('token') || null,
		},
	};
	const [store, dispatch] = useReducer(
		stateReducer,
		initialState
	);
	
	const { loggedInUser, userEmail } = store
	return (
		<div>
			<StateContext.Provider
				value={{ store, dispatch, userEmail }}
			>
				<BrowserRouter>
					<Nav/>
					<h1 className=' my-5 text-center'>
						Tanda Express
					</h1>
					<Switch>
						<Route exact path='/'>
							<Redirect to={loggedInUser ? '/dashboard':'/sign-in'} />
						</Route>

						<Route
							path='/sign-in'
							component={Login}
						></Route>
						<Route
							path='/sign-up'
							component={Signup}
						></Route>
						<Route
							path='/forgot-pass'
							component={ForgotPass}
						></Route>
						<Route
							path='/reset-pass/:token'
							component={ResetPass}
            ></Route>
            <Route
							path='/dashboard'
							component={Dashboard}
            ></Route>
             <Route
							path='/organization/update/:id'
							component={EditOrganization}
            ></Route>
            <Route
							path='/organization/show/:id'
							component={ShowOrganization}
						></Route>
            <Route
							path='/shift/:id'
							component={Shift}
						></Route>

						<Route component={NotFound} />
					</Switch>
				</BrowserRouter>
			</StateContext.Provider>
		</div>
	);
}

export default App;

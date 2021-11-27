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

function App() {
	const initialState = {
		jokes: [],
		categories: [],
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
	return (
		<div>
			<StateContext.Provider
				value={{ store, dispatch }}
			>
				<BrowserRouter>
					<Nav />
					<h1 className=' my-5 text-center'>
						Tanda Compact
					</h1>
					<Switch>
						<Route exact path='/'>
							<Redirect to='/' />
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
							path='/reset-pass'
							component={ResetPass}
						></Route>

						<Route component={NotFound} />
					</Switch>
				</BrowserRouter>
			</StateContext.Provider>
		</div>
	);
}

export default App;

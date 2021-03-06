import React, { useReducer } from 'react';
import stateReducer from '../utils/stateReducer';
import { StateContext } from '../utils/stateContext';
import {
	BrowserRouter,
	Route,
	Switch,
	Redirect,
} from 'react-router-dom';
//import NotFound from './NotFound';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import Nav from './NavigationBar';
import Login from './Login';
import Signup from './Signup';
import ForgotPass from './ForgotPass';
import ResetPass from './ResetPass';
import Dashboard from './Dashboard';
import EditOrganization from './EditOrganization';
import ShowOrganization from './ShowOrganization';
import Shift from './Shift';

function App() {
	//State management
	const initialState = {
		user_id: sessionStorage.getItem('userId') || null,
		userEmail: sessionStorage.getItem('email') || null,
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

	const { loggedInUser, userEmail } = store;

	return (
		<div>
			<StateContext.Provider
				value={{ store, dispatch, userEmail }}
			>
				<BrowserRouter>
					<Nav />
					<h1 className=' my-5 text-center'>
						Tanda Express
					</h1>
					<Switch>
						<Route exact path='/'>
							<Redirect
								to={
									loggedInUser
										? '/dashboard'
										: '/sign-in'
								}
							/>
						</Route>

						<Route
							exact
							path='/sign-in'
							component={Login}
						></Route>
						<Route
							exact
							path='/sign-up'
							component={Signup}
						></Route>
						<Route
							exact
							path='/forgot-pass'
							component={ForgotPass}
						></Route>
						<Route
							exact
							path='/reset-pass/:token'
							component={ResetPass}
						></Route>
						{loggedInUser ? (
							<Route
								exact
								path='/dashboard'
								component={Dashboard}
							></Route>
						) : null}
						{loggedInUser ? (
							<Route
								exact
								path='/organization/update/:id'
								component={EditOrganization}
							></Route>
						) : null}
						{loggedInUser ? (
							<Route
								exact
								path='/organization/show/:id'
								component={ShowOrganization}
							></Route>
						) : null}
						{loggedInUser ? (
							<Route
								exact
								path='/shift/:id'
								component={Shift}
							></Route>
						) : null}

						{/* <Route component={NotFound} /> */}
					</Switch>
				</BrowserRouter>
			</StateContext.Provider>
		</div>
	);
}

export default App;

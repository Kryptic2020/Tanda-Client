import React from 'react';
import { Link, withRouter } from 'react-router-dom';
import {
	Navbar,
	Container,
	Nav,
	Button,
} from 'react-bootstrap';
import { useGlobalState } from '../utils/stateContext';
import { signOut } from '../services/authServices';

const NavigationBar = ({ history }) => {
	const { store, dispatch } = useGlobalState();
	const { loggedInUser } = store;

	function handleSignOut(event) {
		event.preventDefault();
		signOut().then(() => {
			dispatch({
				type: 'setLoggedInUser',
				data: null,
			});
			dispatch({ type: 'setToken', data: null });
			history.push('/');
		});
	}
	return (
		<>
			<Navbar
				collapseOnSelect
				expand='lg'
				bg='dark'
				variant='dark'
			>
				<Container>
					<Navbar.Brand href='#home'>
						{loggedInUser}
					</Navbar.Brand>
					<Nav className='justify-content-end'>
						{loggedInUser ? (
							<Link to='/'>
								<Button
									className='btn btn-sm bg-dark'
									variant='secondary'
									onClick={handleSignOut}
								>
									Logout
								</Button>
							</Link>
						) : (
							<Link to='/sign-in'>
								<Button
									className='btn btn-sm bg-dark'
									variant='secondary'
								>
									Login/Signup
								</Button>
							</Link>
						)}
					</Nav>
				</Container>
			</Navbar>
		</>
	);
};
export default withRouter(NavigationBar);

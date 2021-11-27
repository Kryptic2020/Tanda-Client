import React, { useState } from 'react';
import { useHistory, Link } from 'react-router-dom';
import { signUp } from '../services/authServices';
import { useGlobalState } from '../utils/stateContext';
import { Button, Form } from 'react-bootstrap';

export default function Signup() {
	const initialFormState = {
		username: '',
		email: '',
		password: '',
		password_confirmation: '',
	};
	const [formState, setFormState] = useState(
		initialFormState
	);
	const { dispatch } = useGlobalState();
	let history = useHistory();
	function handleChange(event) {
		setFormState({
			...formState,
			[event.target.name]: event.target.value,
		});
	}
	function handleRegister(event) {
		event.preventDefault();
		signUp(formState).then((data) => {
			sessionStorage.setItem('token', data.jwt);
			sessionStorage.setItem('user', data.username);
			dispatch({
				type: 'setLoggedInUser',
				data: data.username,
			});
			history.push('/');
		});
	}
	return (
		<>
			<Form className='container col-11 col-md-9 col-lg-4 bg-light my-5 p-5 rounded'>
				<Form.Group
					className='mb-3'
					controlId='name'
				>
					<Form.Label>Full name</Form.Label>
					<Form.Control
						type='text'
						placeholder='Enter full name'
						name='username'
						value={formState.username}
						onChange={handleChange}
					/>
				</Form.Group>

				<Form.Group
					className='mb-3'
					controlId='email'
				>
					<Form.Label>Email address</Form.Label>
					<Form.Control
						type='email'
						placeholder='Enter email'
						name='email'
						value={formState.email}
						onChange={handleChange}
					/>
				</Form.Group>
				<Form.Group
					className='mb-3'
					controlId='password'
				>
					<Form.Label>Password</Form.Label>
					<Form.Control
						type='password'
						placeholder='Password'
						name='password'
						value={formState.password}
						onChange={handleChange}
					/>
				</Form.Group>
				<Form.Group
					className='mb-3'
					controlId='passwordConfirmation'
				>
					<Form.Label>
						Password Confirmation
					</Form.Label>
					<Form.Control
						type='password'
						placeholder='Password Confirmation'
						name='password_confirmation'
						value={
							formState.password_confirmation
						}
						onChange={handleChange}
					/>
				</Form.Group>

				<div className='d-flex justify-content-between mt-5'>
					<Button
						variant='dark'
						onClick={handleRegister}
					>
						Sign Up
					</Button>
					<Link className='mt-1' to='/sign-in'>
						Sign in
					</Link>
				</div>
			</Form>
		</>
	);
}

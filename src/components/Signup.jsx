import React, { useState } from 'react';
import { useHistory, Link } from 'react-router-dom';
import { signUp } from '../services/authServices';
import { useGlobalState } from '../utils/stateContext';
import { Button, Form } from 'react-bootstrap';
import { pattern } from '../utils/authValidation';

export default function Signup() {
	const initialFormState = {
		username: '',
		email: '',
		password: '',
		password_confirmation: '',
		email_error: '',
		password_error: '',
		errors:''
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
			email_error: '',
			errors:''
		});
	}
	function handleRegister(event) {
		const isValid = pattern.test(formState.email);
		if (isValid) {
			if (
				formState.password ===
				formState.password_confirmation
			) {
				event.preventDefault();
				signUp(formState).then((data) => {
					if (data.errors){setFormState({
			  ...formState,
		  	errors: data.errors
					});
					} else {
					console.log(data)
					sessionStorage.setItem(
						'token',
						data.jwt
					);
					sessionStorage.setItem(
						'user',
						data.username
					);
					dispatch({
						type: 'setLoggedInUser',
						data: data.username,
					});
					history.push('/');	
			 }
					
				});
			} else {
				setFormState({
					...formState,
					password_error:
						'Password does not match',
				});
			}
		} else {
			setFormState({
				...formState,
				email_error: 'Invalid email address',
			});
		}
	}
	return (
		<>
			<Form className='container col-11 col-md-9 col-lg-4 bg-light my-5 p-5 rounded'>
			<Form.Text className='text-danger'>
						{formState.errors ? formState.errors : null}
					</Form.Text>
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
					<Form.Text className='text-danger'>
						{formState.email_error
							? formState.email_error
							: null}
					</Form.Text>
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
					<Form.Text className='text-muted'>
						(6 characters minimum)
					</Form.Text>
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
					<Form.Text className='text-danger'>
						{formState.password_error
							? formState.password_error
							: null}
					</Form.Text>
				</Form.Group>

				<div className='d-flex justify-content-between mt-5'>
					<Button
						disabled={
							!formState.email ||
							formState.password.length < 6 ||
							formState.password_confirmation
								.length < 6 ||
							!formState.username
						}
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

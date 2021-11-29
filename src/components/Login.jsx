import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { signIn } from '../services/authServices';
import { useGlobalState } from '../utils/stateContext';
import { Button, Form } from 'react-bootstrap';

export default function SignIn({ history }) {
	const initialFormState = {
		email: '',
		password: '',
		errors: '',
	};
	const [formState, setFormState] = useState(
		initialFormState
	);
	const { dispatch } = useGlobalState();
	function handleChange(event) {
		setFormState({
			...formState,
			[event.target.name]: event.target.value,

			errors: '',
		});
	}
	function handleSubmit(event) {
		event.preventDefault();
		signIn(formState)
			.then(({ username, jwt, errors }) => {
				if (errors) {
					setFormState({
						...formState,
						errors: errors,
					});
				} else {
					console.log(username, jwt, errors);
					sessionStorage.setItem('token', jwt);
					sessionStorage.setItem(
						'user',
						username
					);
					sessionStorage.setItem(
						'email',
						formState.email
					);
					dispatch({
						type: 'setLoggedInUser',
						data: username,
					});
					dispatch({
						type: 'setUserEmail',
						data: formState.email,
					});
					dispatch({
						type: 'setToken',
						data: jwt,
					});
					history.push('/');
				}
			})
			.catch((error) => console.log(error));
	}
	return (
		<>
			<Form className='container col-11 col-md-9 col-lg-4 bg-light my-5 p-5 rounded'>
				<Form.Text className='text-danger'>
					{formState.errors
						? formState.errors
						: null}
				</Form.Text>
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
					<Form.Text className='text-muted'>
						We'll never share your email with
						anyone else.
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
				</Form.Group>
				<Link className='mt-5' to='/forgot-pass'>
					Forgot password ?
				</Link>

				<div className='d-flex justify-content-between mt-5'>
					<Button
						variant='dark'
						onClick={handleSubmit}
					>
						Login
					</Button>
					<Link className='mt-1' to='/sign-up'>
						Sign up
					</Link>
				</div>
			</Form>
		</>
	);
}

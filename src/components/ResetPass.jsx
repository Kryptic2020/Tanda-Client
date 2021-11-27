import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { resetPass } from '../services/authServices';
import { Button, Form } from 'react-bootstrap';

export default function ResetPass() {
	const initialFormState = {
		password: '',
		password_confirmation: '',
	};
	const [formState, setFormState] = useState(
		initialFormState
	);
	let history = useHistory();
	function handleChange(event) {
		setFormState({
			...formState,
			[event.target.name]: event.target.value,
		});
	}
	function handleResetPass(event) {
		event.preventDefault();
		resetPass(formState).then((data) => {
			console.log(data);
			history.push('/');
		});
	}
	return (
		<>
			<Form className='container col-11 col-md-9 col-lg-4 bg-light my-5 p-5 rounded'>
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
						onClick={handleResetPass}
					>
						Reset Password
					</Button>
				</div>
			</Form>
		</>
	);
}

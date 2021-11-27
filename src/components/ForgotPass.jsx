import React, { useState } from 'react';
import { forgotPass } from '../services/authServices';
import { Button, Form } from 'react-bootstrap';

export default function ForgotPass() {
	const initialFormState = {
		email: '',
	};
	const [formState, setFormState] = useState(
		initialFormState
	);
	function handleChange(event) {
		setFormState({
			...formState,
			[event.target.name]: event.target.value,
		});
	}
	function handleSubmit(event) {
		event.preventDefault();
		forgotPass(formState)
			.then((data) => {
				console.log(data);
			})
			.catch((error) => console.log(error));
	}
	return (
		<>
			<Form className='container col-11 col-md-9 col-lg-4 bg-light my-5 p-5 rounded'>
				<Form.Group
					className='mb-5'
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

				<Button
					variant='dark'
					onClick={handleSubmit}
				>
					Submit
				</Button>
			</Form>
		</>
	);
}

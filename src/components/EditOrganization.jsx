import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { signIn } from '../services/authServices';
import { useGlobalState } from '../utils/stateContext';
import { Button, Form } from 'react-bootstrap';

export default function EditOrganization(history) {
  	const initialFormState = {
		name: '',
		hourly_rate: '',
	};
	const [formState, setFormState] = useState(
		initialFormState
	);
	const { dispatch } = useGlobalState();
	function handleChange(event) {
		setFormState({
			...formState,
			[event.target.name]: event.target.value,
		});
	}
	function handleSubmit(event) {
		event.preventDefault();
		signIn(formState)
			.then(({ username, jwt }) => {
				console.log(username, jwt);
				dispatch({
					type: 'setLoggedInUser',
					data: username,
				});
				dispatch({ type: 'setToken', data: jwt });
				history.push('/');
			})
			.catch((error) => console.log(error));
	}
  return (
    <div>
      <section className='container col-11 col-md-9 col-lg-3 bg-light my-2 py-5 px-4 rounded'>
				<Form>
					<h3>Update organization</h3>
					<Form.Group
						className='my-5'
						controlId='email'
					>
						<Form.Label>Name</Form.Label>
						<Form.Control
							type='text'
							placeholder='ex. Burger King'
							name='name'
							value={formState.name}
							onChange={handleChange}
						/>
					</Form.Group>
					<Form.Group
						className='mb-3'
						controlId='password'
					>
						<Form.Label>
							Hourly rate $
						</Form.Label>
						<Form.Control
							type='number'
							placeholder='0.00'
							name='hourly_rate'
							value={formState.hourly_rate}
							onChange={handleChange}
						/>
					</Form.Group>

						<div className='d-flex justify-content-between mt-5'>
					<Button
						variant='dark'
						onClick={handleSubmit}
					>
						Update
					</Button>
					<Link className='mt-1' to='/dashboard'>
						Delete
					</Link>
				</div>
				</Form>
			</section>
      
    </div>
  )
}

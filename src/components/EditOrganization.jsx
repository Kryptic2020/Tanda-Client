import React, { useState, useEffect } from 'react';
import {
	showOrg,
	updateOrg,
	destroyOrg,
} from '../services/organizationServices';
import { useGlobalState } from '../utils/stateContext';
import { Button, Form } from 'react-bootstrap';

export default function EditOrganization(history) {
	//State management
	const { userEmail } = useGlobalState();
	const initialFormState = {
		name: '',
		hourly_rate: '',
		user_email: userEmail,
		org_id: history.match.params.id,
	};
	const [formState, setFormState] = useState(
		initialFormState
	);

	//fetch organization
	const fetchOrg = () => {
		showOrg(history.match.params.id).then((data) => {
			setFormState({
				...formState,
				name: data.name,
				hourly_rate: data.hourly_rate,
			});
		});
	};

	//Load organization
	useEffect(() => {
		fetchOrg();
	}, []);

	//handle user input
	function handleChange(event) {
		setFormState({
			...formState,
			[event.target.name]: event.target.value,
		});
	}

	// handle organization update
	function handleUpdate() {
		updateOrg(formState)
			.then(() => {
				history.history.push('/');
			})
			.catch((error) => console.log(error));
	}

	//Delete organization
	function handleDelete() {
		destroyOrg(formState.org_id)
			.then(() => {
				history.history.push('/');
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
							onClick={handleUpdate}
						>
							Update
						</Button>
						<Button
							variant='danger'
							onClick={handleDelete}
						>
							Delete
						</Button>
					</div>
				</Form>
			</section>
		</div>
	);
}

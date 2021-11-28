import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { signIn } from '../services/authServices';
import { useGlobalState } from '../utils/stateContext';
import { Button, Form } from 'react-bootstrap';

export default function ViewOrganization(history) {
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
					<h3>Burger King</h3>
						<div className='d-flex justify-content-between mt-5'>
					<Link to='/shift'><Button
						variant='dark'
					>
						View Shifts
					</Button></Link>
					<Link className='mt-1' to='/organization-update'>
						Edit
            </Link>
            <Link className='mt-1' to='/sign-up'>
						Leave
					</Link>
				</div>
				</Form>
			</section>
      
    </div>
  )
}

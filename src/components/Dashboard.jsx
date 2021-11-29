import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
	getOrgs,
	joinOrg,
	newOrg,
	getJoinedOrgs,
} from '../services/organizationServices';
import { useGlobalState } from '../utils/stateContext';
import { Button, Form } from 'react-bootstrap';

export default function Dashboard() {
	const { userEmail } = useGlobalState();

	const initialFormState = {
		name: '',
		hourly_rate: '',
		user_email: userEmail,
		org_id: '',
	};

	const [formState, setFormState] = useState(
		initialFormState
	);
	const [orgState, setOrgState] = useState([]);
	const [joinedOrgState, setjoinedOrgState] = useState(
		[]
	);
	const [msgState, setMsgState] = useState();

	function fetchOrgs() {
		getOrgs().then((data) => {
			setOrgState(data);
		});
	}

	function fetchJoinedOrgs() {
		getJoinedOrgs(formState).then((data) => {
			setjoinedOrgState(data);
		});
	}

	function handleChange(event) {
		setFormState({
			...formState,
			[event.target.name]: event.target.value,
		});
	}

	function handleJoin(id) {
		const joined = joinedOrgState.find(
			(el) => el.id === id
		);
		if (joined) {
			setMsgState(
				'You are already a member of this organization'
			);
			setTimeout(() => {
				setMsgState('');
			}, 3000);
		} else {
			const data = {
				org_id: id,
				user_email: userEmail,
			};
			joinOrg(data)
				.then((data) => {
					console.log(data);
					fetchJoinedOrgs();
				})
				.catch((error) => console.log(error));
		}
	}

	function handleSubmit(event) {
		event.preventDefault();
		newOrg(formState)
			.then(() => {
				fetchOrgs();
				fetchJoinedOrgs();
				window.scrollTo(0, 0);
				setFormState({
					...formState,
					name: '',
					hourly_rate: '',
				});
			})
			.catch((error) => console.log(error));
	}

	useEffect(() => {
		fetchOrgs();
		fetchJoinedOrgs();
	}, []);

	return (
		<div className='bg-dark py-5 rounded d-flex flex-wrap mb-5'>
			<section className='container col-11 col-md-9 col-lg-4 bg-light my-2 py-5 px-4 rounded'>
				<h5 className='m-4 text-danger'>
					{msgState && msgState}
				</h5>
				<h3 className='m-4'>Organization list</h3>
				{orgState &&
					orgState.map((org, index) => (
						<ul>
							<li
								key={index}
								className='d-flex justify-content-between'
							>
								<p className='w-50 muted'>
									{org.name}
								</p>
								<div>
									<Link
										to={`/organization/update/${org.id}`}
									>
										<Button
											className='mx-3 btn btn-sm'
											variant='primary'
										>
											Edit
										</Button>
									</Link>
									<Button
										className='btn btn-sm'
										variant='dark'
										onClick={() =>
											handleJoin(
												org.id
											)
										}
									>
										join
									</Button>
								</div>
							</li>
						</ul>
					))}
			</section>
			<section className='container col-11 col-md-9 col-lg-4 bg-light my-2 py-5 px-4 rounded'>
				<h3 className='m-4'>Joined list</h3>
				{joinedOrgState &&
					joinedOrgState.map((org, index) => (
						<ul>
							<li
								key={index}
								className='d-flex justify-content-between'
							>
								<p className='w-50 muted'>
									{org.name}
								</p>
								<Link
									to={`/organization/show/${org.id}`}
								>
									<Button
										className='mx-3 btn btn-sm'
										variant='info'
									>
										See
									</Button>
								</Link>
							</li>
						</ul>
					))}
			</section>

			<section className='container col-11 col-md-9 col-lg-3 bg-light my-2 py-5 px-4 rounded'>
				<Form>
					<h3>Create organization</h3>
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
							Create and Join
						</Button>
					</div>
				</Form>
			</section>
		</div>
	);
}

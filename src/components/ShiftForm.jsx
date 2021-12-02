import React, { useState, useEffect } from 'react';
import { Button } from 'react-bootstrap';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import TextField from '@mui/material/TextField';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import MobileTimePicker from '@mui/lab/MobileTimePicker';
import { useGlobalState } from '../utils/stateContext';
import {
	newShift,
	updateShift,
} from '../services/shiftServices';
//import { showOrg } from '../services/organizationServices';

export default function ShiftForm({
	shift,
	close_modal,
	org_id,
	set_table,
}) {
	const { store } = useGlobalState();
	const { loggedInUser, userEmail } = store;

	let initialFormState = {};

	if (shift) {
		initialFormState = {
			username: loggedInUser,
			email: userEmail,
			dateState: new Date(shift.date),
			startTimeState: new Date(shift.start),
			finishTimeState: new Date(shift.finish),
			breakState: shift.break,
			shiftIdState: shift.id,
		};
	} else {
		initialFormState = {
			username: loggedInUser,
			email: userEmail,
			dateState: new Date(),
			startTimeState: null,
			finishTimeState: null,
			breakState: null,
		};
	}

	const [formState, setFormState] = useState(
		initialFormState
	);

	function handleChange(key, value) {
		setFormState({
			...formState,
			[key]: value,
		});
	}

	function handleSubmit() {
		const formData = {
			user_email: userEmail,
			org_id,
			date: formState.dateState,
			start_time: formState.startTimeState,
			finish_time: formState.finishTimeState,
			break: formState.breakState,
			shift_id: formState.shiftIdState,
		};
		if (shift) {
			updateShift(formData)
				.then((data) => {
					close_modal();
					set_table();
				})
				.catch((error) => console.log(error));
		} else {
			newShift(formData)
				.then((data) => {
					close_modal();
					set_table();
				})
				.catch((error) => console.log(error));
		}
	}

	return (
		<>
			<LocalizationProvider
				dateAdapter={AdapterDateFns}
			>
				<h3 className='text-center rounded p-5 m-0'>
					{shift ? 'Edit' : 'Enter'} shift
				</h3>
				<div className='rounded mb-5 mx-auto py-5 py-lg-1 d-flex flex-wrap col-12 col-md-8 col-lg-11 bg-light text-center row'>
					<div className='row col-10 col-lg-2 p-0 my-2 mx-auto'>
						{' '}
						<input
							className='bg-light border height'
							value={loggedInUser}
							readOnly
						></input>
					</div>

					<div className=' row col-10 col-lg-2 p-0 my-2 mx-auto'>
						<DatePicker
							name='dateState'
							className='bg-light border height'
							dateFormat='dd/MM/yyyy'
							selected={formState.dateState}
							onChange={(data) =>
								handleChange(
									'dateState',
									data
								)
							}
						/>
					</div>
					<div className='row col-10 col-lg-2 p-0 my-2 mx-auto'>
						<MobileTimePicker
							label='Start Time'
							value={formState.startTimeState}
							onChange={(data) =>
								handleChange(
									'startTimeState',
									data
								)
							}
							renderInput={(params) => (
								<TextField {...params} />
							)}
						/>
					</div>
					<div className='row col-10 col-lg-2 p-0 my-2 mx-auto'>
						<MobileTimePicker
							label='Finish Time'
							value={
								formState.finishTimeState
							}
							onChange={(data) =>
								handleChange(
									'finishTimeState',
									data
								)
							}
							renderInput={(params) => (
								<TextField {...params} />
							)}
						/>
					</div>

					<div className='row col-10 col-lg-2 p-0 my-2 mx-auto'>
						{' '}
						<input
							type='number'
							value={formState.breakState}
							className='bg-light border height'
							placeholder='Enter Break (minutes only)'
							onChange={(data) =>
								handleChange(
									'breakState',
									data.target.value
								)
							}
						></input>
					</div>
					<Button
						className='btn btn-lg col-10 col-lg-1 my-5 my-lg-2 mx-auto b-height row'
						disabled={
							!formState.startTimeState ||
							!formState.finishTimeState ||
							!formState.breakState
						}
						onClick={handleSubmit}
					>
						Submit
					</Button>
				</div>
			</LocalizationProvider>
		</>
	);
}

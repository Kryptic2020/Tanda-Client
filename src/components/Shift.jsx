import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button, Table } from 'react-bootstrap';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import TextField from '@mui/material/TextField';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import MobileTimePicker from '@mui/lab/MobileTimePicker';
import { useGlobalState } from '../utils/stateContext';
import {
	newShift,
	shifts,
} from '../services/shiftServices';
import { showOrg } from '../services/organizationServices';

export default function Shift(history) {
	const { store } = useGlobalState();
	const { loggedInUser, userEmail } = store;

	const [dateState, setDateState] = useState(new Date());
	const [startTimeState, setStartTimeState] =
		useState(null);
	const [finishTimeState, setFinishTimeState] =
		useState(null);
	const [breakState, setBreakState] = useState();
	const [shiftsState, setShiftsState] = useState([{}]);
	const [orgState, setOrgState] = useState({});

	//const [show, setShow] = useState(false);
	//const handleClose = () => setShow(false);
	//const handleShow = () => setShow(true);

	function handleSubmit() {
		const formData = {
			user_email: userEmail,
			org_id: history.match.params.id,
			date: dateState,
			start_time: startTimeState,
			finish_time: finishTimeState,
			break: breakState,
		};
		newShift(formData)
			.then((data) => {
				console.log(data);
				seTable();
				window.scrollTo(0, 0);
			})
			.catch((error) => console.log(error));
	}

	function seTable() {
		shifts(history.match.params.id).then((data) => {
			console.log(data);
			setShiftsState(data);
		});
		showOrg(history.match.params.id).then((data) => {
			setOrgState(data);
		});
	}

	function handleChange(event) {
		setBreakState(event.target.value);
	}
	useEffect(() => {
		seTable();
	}, []);

	const convertDate = (date) => {
		return new Date(date).toLocaleDateString('es-ES', {
			year: 'numeric',
			month: 'numeric',
			day: 'numeric',
		});
	};

	const convertTime = (data) => {
		let time =
			new Date(data).getHours() +
			':' +
			new Date(data).getMinutes();
		return time;
	};

	const getWorkedHours = (start, finish, coffee) => {
		const end =
			new Date(finish).getTime() / (1000 * 60);
		const init =
			new Date(start).getTime() / (1000 * 60);
		const result = end - init - coffee;
		return Math.round(result);
	};
	// const modal = (<Modal show={show} onHide={handleClose} animation={false}>
	//     <Modal.Header closeButton>
	//       <Modal.Title>Modal heading</Modal.Title>
	//     </Modal.Header>
	//     <Modal.Body>Woohoo, you're reading this text in a modal!</Modal.Body>
	//     <Modal.Footer>
	//       <Button variant="secondary" onClick={handleClose}>
	//         Close
	//       </Button>
	//       <Button variant="primary" onClick={handleClose}>
	//         Save Changes
	//       </Button>
	//     </Modal.Footer>
	// </Modal>)

	const table_heading = [
		'Employee name',
		'Shift date',
		'Start time',
		'Finish time',
		'Break length (minutes)',
		'Hours worked',
		'Overnigth hours',
		'Shift cost',
	];

	return (
		<>
			<div className='col-12 col-md-11 m-auto'>
				<h2 className='my-5 text-center'>
					{orgState.name}
				</h2>
				<div className='d-flex justify-content-between'>
					<h5 className='px-3'>Shifts</h5>
					<Link className='px-3' to='/dashboard'>
						Back
					</Link>
				</div>
				<Table
					className='my-2'
					responsive
					striped
					bordered
					hover
					variant='dark'
				>
					<thead>
						<tr>
							<th>#</th>
							{table_heading.map(
								(th, index) => (
									<th key={index}>
										{th}
									</th>
								)
							)}
						</tr>
					</thead>
					<tbody>
						{shiftsState &&
							shiftsState.map((el, index) => (
								<tr>
									<td>{index}</td>
									<td>{el.name}</td>
									<td>
										{convertDate(
											el.date
										)}
									</td>
									<td>
										{convertTime(
											el.start
										)}
									</td>
									<td>
										{convertTime(
											el.finish
										)}
									</td>
									<td>{el.break}</td>
									<td>
										{getWorkedHours(
											el.start,
											el.finish,
											el.break
										)}
									</td>
									<td>0</td>
									<td>
										{(
											getWorkedHours(
												el.start,
												el.finish,
												el.break
											) *
											orgState.hourly_rate
										).toLocaleString(
											'en-US',
											{
												style: 'currency',
												currency:
													'USD',
											}
										)}
									</td>
								</tr>
							))}
					</tbody>
				</Table>
			</div>
			<LocalizationProvider
				dateAdapter={AdapterDateFns}
			>
				<h3 className='text-center rounded p-5 m-0'>
					Enter shift
				</h3>
				{/* {modal} */}
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
							className='bg-light border height'
							dateFormat='dd/MM/yyyy'
							selected={dateState}
							onChange={(date) =>
								setDateState(date)
							}
						/>
					</div>
					<div className='row col-10 col-lg-2 p-0 my-2 mx-auto'>
						<MobileTimePicker
							label='Start Time'
							value={startTimeState}
							onChange={(newValue) => {
								setStartTimeState(newValue);
							}}
							renderInput={(params) => (
								<TextField {...params} />
							)}
						/>
					</div>
					<div className='row col-10 col-lg-2 p-0 my-2 mx-auto'>
						<MobileTimePicker
							label='Finish Time'
							value={finishTimeState}
							onChange={(newValue) => {
								setFinishTimeState(
									newValue
								);
							}}
							renderInput={(params) => (
								<TextField {...params} />
							)}
						/>
					</div>

					<div className='row col-10 col-lg-2 p-0 my-2 mx-auto'>
						{' '}
						<input
							type='number'
							value={breakState}
							className='bg-light border height'
							placeholder='Enter Break (minutes only)'
							onChange={handleChange}
						></input>
					</div>
					<Button
						className='btn btn-lg col-10 col-lg-1 my-5 my-lg-2 mx-auto b-height row'
						disabled={
							!startTimeState ||
							!finishTimeState ||
							!breakState
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

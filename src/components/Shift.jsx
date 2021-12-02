import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
	Table,
	Modal,
	Button,
	Tooltip,
	OverlayTrigger,
} from 'react-bootstrap';
import { useGlobalState } from '../utils/stateContext';
import {
	shifts,
	deleteShift,
} from '../services/shiftServices';
import { showOrg } from '../services/organizationServices';
import CreateIcon from '@mui/icons-material/Create';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import DeleteIcon from '@mui/icons-material/Delete';
import ShiftForm from './ShiftForm';
import BreakForm from './BreakForm';

export default function Shift(history) {
	//State management
	const { store } = useGlobalState();
	const { current_user } = store;
	const [shiftsState, setShiftsState] = useState([{}]);
	const [shiftState, setShiftState] = useState({});
	const [orgState, setOrgState] = useState({});
	const [showModalCreate, setShowModalCreate] =
		useState(false);
	const [showModalUpdate, setShowModalUpdate] =
		useState(false);
	const [showModalBreak, setShowModalBreak] =
		useState(false);
	const handleCloseModal = () => {
		setShowModalBreak(false);
		setShowModalCreate(false);
		setShowModalUpdate(false);
		set_table();
	};
	const org_id = history.match.params.id;

	//fetch shifts
	const set_table = () => {
		shifts(org_id).then((data) => {
			setShiftsState(data);
		});
		showOrg(org_id).then((data) => {
			setOrgState(data);
		});
	};

	//convert date formats
	function convertDate(date) {
		return new Date(date).toLocaleDateString('es-ES', {
			year: 'numeric',
			month: 'numeric',
			day: 'numeric',
		});
	}

	//convert time formats
	function convertTime(data) {
		let time =
			new Date(data).getHours() +
			':' +
			((new Date(data).getMinutes() < 10 ? '0' : '') +
				new Date(data).getMinutes());
		return time;
	}

	//work hours calculations
	function getWorkedHours(start, finish, coffee) {
		const end =
			new Date(finish).getTime() / (1000 * 60);
		const init =
			new Date(start).getTime() / (1000 * 60);
		const result = end - init - sumBreak(coffee);
		return (Math.round(result) / 60).toFixed(2);
	}

	//Modal shift form - add new shift
	const modalCreateShift = (
		<Modal
			fullscreen={true}
			show={showModalCreate}
			onHide={handleCloseModal}
			animation={false}
		>
			<Modal.Header
				className='bg-light'
				closeButton
			></Modal.Header>
			<Modal.Body>
				<ShiftForm
					set_table={set_table}
					close_modal={handleCloseModal}
					org_id={org_id}
				/>
			</Modal.Body>
		</Modal>
	);

	//Modal shift form - update shift
	const modalUpdateShift = (
		<Modal
			fullscreen={true}
			show={showModalUpdate}
			onHide={handleCloseModal}
			animation={false}
		>
			<Modal.Header
				className='bg-light'
				closeButton
			></Modal.Header>
			<Modal.Body>
				<ShiftForm
					set_table={set_table}
					close_modal={handleCloseModal}
					shift={shiftState}
				/>
			</Modal.Body>
		</Modal>
	);

	//Modal break form - add / remove breaks
	const modalUpdateBreak = (
		<Modal
			fullscreen={true}
			show={showModalBreak}
			onHide={handleCloseModal}
			animation={false}
		>
			<Modal.Header
				className='bg-light'
				closeButton
			></Modal.Header>
			<Modal.Body>
				<BreakForm
					close_modal={handleCloseModal}
					shift={shiftState}
				/>
			</Modal.Body>
		</Modal>
	);

	//shift table headings
	const table_heading = [
		'Employee name',
		'Shift date',
		'Start time',
		'Finish time',
		'Break length (minutes)',
		'Add/ Remove Breaks',
		'Hours worked',
		'Overnigth hours',
		'Shift cost',
		'Edit',
		'Delete',
	];

	// sum break array for a better display and other calculation functions
	function sumBreak(data) {
		let result = null;
		if (data && data.length > 1) {
			result = data.reduce((a, b) => a + b);
		} else {
			result = data;
		}
		return result;
	}

	//add break submission
	function handleAddBreak(shift) {
		setShiftState(shift);
		setShowModalBreak(true);
	}

	//update shift submission
	function handleUpdateShift(shift) {
		setShiftState(shift);
		setShowModalUpdate(true);
	}

	//tooltip for add shift button
	const renderTooltip = (props) => (
		<Tooltip id='button-tooltip' {...props}>
			Click here to Add a Shift
		</Tooltip>
	);

	//delete shift submission
	function handleDelete(id) {
		deleteShift(id).then((data) => {
			set_table();
			console.log(data);
		});
	}

	//Load shifts
	useEffect(() => {
		set_table();
	}, []);

	return (
		<>
			<div className='col-12 col-md-11 m-auto'>
				<h2 className='my-5 text-center'>
					{orgState.name}
				</h2>
				{modalUpdateShift}
				{modalCreateShift}
				{modalUpdateBreak}
				<div className='d-flex justify-content-between'>
					<OverlayTrigger
						placement='top'
						delay={{ show: 250, hide: 400 }}
						overlay={renderTooltip}
					>
						<Button
							variant='primary'
							className='p-2 m-2'
							onClick={() => {
								setShowModalCreate(true);
							}}
						>
							<AddCircleOutlineIcon className='mx-1' />
							Add Shifts
						</Button>
					</OverlayTrigger>
					<Link
						className='px-3 my-3'
						to='/dashboard'
					>
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
								<tr
									key={index}
									className='m-auto text-center'
								>
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
									<td>
										{sumBreak(el.break)}
									</td>
									<td>
										{current_user.id ===
										el.user_id ? (
											<AddCircleIcon
												className='text-secondary'
												onClick={() => {
													handleAddBreak(
														el
													);
												}}
											/>
										) : null}
									</td>
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
									<td>
										{current_user.id ===
										el.user_id ? (
											<CreateIcon
												className='text-secondary'
												onClick={() => {
													handleUpdateShift(
														el
													);
												}}
											/>
										) : null}
									</td>
									<td>
										{current_user.id ===
										el.user_id ? (
											<DeleteIcon
												className='text-secondary'
												onClick={() => {
													handleDelete(
														el.id
													);
												}}
											/>
										) : null}
									</td>
								</tr>
							))}
					</tbody>
				</Table>
			</div>
		</>
	);
}

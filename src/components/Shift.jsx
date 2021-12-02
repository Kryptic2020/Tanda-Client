import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
	Table,
	Modal,
	Button,
	Tooltip,
	OverlayTrigger,
} from 'react-bootstrap';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';
import Switch from '@mui/material/Switch';
import { useGlobalState } from '../utils/stateContext';
import {
	activeShifts, inactiveShifts,
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
	const { user_id } = store;
	const [shiftsState, setShiftsState] = useState([{}]);
	const [shiftState, setShiftState] = useState({});
	const [orgState, setOrgState] = useState({});
	const [active, setActive] = useState(true);
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
		if (active) {
	activeShifts(org_id).then((data) => {
			setShiftsState(data);
		});
		} else {
				inactiveShifts(org_id).then((data) => {
			setShiftsState(data);
		});

		}
	
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
		let day = 0;
		if (finish < start) { day = 1000 * 60 * 60 * 24}
		const end =
			(new Date(finish).getTime()+ day) / (1000 * 60);
		const init =
			new Date(start).getTime() / (1000 * 60);
		const result = end - init - sumBreak(coffee);
		return (Math.round(result) / 60).toFixed(2);
	}

		//calculate overnight shift
	function getOvernight(start, finish, coffee) {
		let day = 1000 * 60 * 60 * 24;
		let result = 0;
		if (finish < start) {
			const end =
			(new Date(finish).getTime()+ day) / (1000 * 60);
		const init =
			new Date(start).getTime() / (1000 * 60);
		result = (Math.round(end - init - sumBreak(coffee)) / 60).toFixed(2);
		}		
		return result	
	}

	//calculate sunday overtime
	function penaltyTimeCalc(start) {
		const time = new Date(start).getMinutes() + new Date(start).getHours() * 60		
		const day = 60 * 24		
		return day - time
	}

 //check if date is sunday
	function isSunday(date) {
		if (new Date(date).getDay() === 0) {
				return true
		} else {
			return false
		}
	}
	function isSaturday(date) {
		if (new Date(date).getDay() === 6) {
			return true; 
		} else {
			return false
		}
	}

	//calculate shift cost
	function shiftCost(date, start, finish, coffee, rate) {
		let cost = 0;
		if (isSunday(date)) {
			if (getOvernight(start, finish, coffee) === 0) {
				cost = getWorkedHours(start, finish, coffee)*rate*2
			} else {
				const regular = getOvernight(start, finish, coffee) - penaltyTimeCalc(start);
				if (regular < 0) {
					cost = (penaltyTimeCalc(start) - regular) * rate *2
				} else {cost = (penaltyTimeCalc(start)*2 + regular) * rate}			
			}
		} else if (isSaturday(date)) {
			if (getOvernight(start, finish, coffee) === 0) {
				cost = getWorkedHours(start, finish, coffee)*rate
			} else {
				const regular = getOvernight(start, finish, coffee) - penaltyTimeCalc(start);
				if (regular < 0) {
					cost = (penaltyTimeCalc(start) - regular) * rate
				} else {
					cost = (penaltyTimeCalc(start) + (regular *2)) * rate
				}
			}
			
		} else {cost = getWorkedHours(start, finish, coffee)*rate}
		return cost
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
		});
	}

	//handle active/inactive employee shifts display
	function handleSwitchChange(e) {
		if (e.target.checked === true) { setActive(true); } else { setActive(false); };
	}

 //Switch styling
	const AntSwitch = styled(Switch)(({ theme }) => ({
  width: 56,
  height: 32,
  padding: 0,
  display: 'flex',
  '&:active': {
    '& .MuiSwitch-thumb': {
      width: 30,
    },
    '& .MuiSwitch-switchBase.Mui-checked': {
      transform: 'translateX(18px)',
    },
  },
  '& .MuiSwitch-switchBase': {
    padding: 4,
    '&.Mui-checked': {
      transform: 'translateX(24px)',
      color: '#fff',
      '& + .MuiSwitch-track': {
        opacity: 1,
        backgroundColor: theme.palette.mode === 'dark' ? '#177ddc' : '#1890ff',
      },
    },
  },
  '& .MuiSwitch-thumb': {
    boxShadow: '0 2px 4px 0 rgb(0 35 11 / 20%)',
    width: 24,
    height: 24,
    borderRadius: 12,
    transition: theme.transitions.create(['width'], {
      duration: 300,
    }),
  },
  '& .MuiSwitch-track': {
    borderRadius: 32 / 2,
    opacity: 1,
    backgroundColor:
      theme.palette.mode === 'dark' ? 'rgba(255,255,255,.35)' : 'rgba(0,0,0,.25)',
    boxSizing: 'border-box',
  },
}));


	//Load shifts
	useEffect(() => {
		set_table();
	}, [active]);

	return (
		<>
			<div className='col-12 col-md-11 m-auto'>
				<h2 className='my-5 text-center'>
					{orgState.name}
				</h2>
				<div className=" col mx-auto my-3 p-3 bg-light text-center d-flex flex-column">
				<h5>Which employees should be displayed?</h5>
				 <Stack className="col col-md-4 col-lg-4 m-auto my-3" direction="row" spacing={1} alignItems="center">
        <Typography>Inactive only</Typography>
        <AntSwitch onChange={handleSwitchChange} checked={active} inputProps={{ 'aria-label': 'ant design' }} />
        <Typography>Active Only</Typography>
					</Stack>
				</div>
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
					className='mt-3 mb-5'
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
										{user_id && Number(user_id) ===
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
									<td>{getOvernight(el.start,
											el.finish,
											el.break)}</td>
									<td>
										{(
											shiftCost(
												el.date,
												el.start,
												el.finish,
												el.break,											
											orgState.hourly_rate)
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
										{user_id && Number(user_id) ===
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
										{user_id && Number(user_id) ===
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

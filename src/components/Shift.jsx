import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
	Table,
	Modal,
	Button,
	Tooltip,
	Form,
	OverlayTrigger,
} from 'react-bootstrap';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';
import Switch from '@mui/material/Switch';
import {
	getShifts,
	deleteShift,
} from '../services/shiftServices';
import { showOrg } from '../services/organizationServices';
import CreateIcon from '@mui/icons-material/Create';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import DeleteIcon from '@mui/icons-material/Delete';
import ShiftForm from './ShiftForm';
import BreakForm from './BreakForm';
import Datepicker from './Datepicker';
import { convertTime, convertDate, getWorkedHours, getOvernight, sumBreak, shiftCost, table_heading } from '../utils/shiftFunctions';

export default function Shift(history) {
	//State management
	const user_id = sessionStorage.getItem('userId');
	const [shiftsState, setShiftsState] = useState([]);
	const [shiftState, setShiftState] = useState({});
	const [orgState, setOrgState] = useState({});
	const [active, setActive] = useState(true);
	const [isLoading, setIsLoading] = useState(true);
	const [date, setDate] = useState();
	const [searchEmployeeState,setSearchEmployeeState] = useState('')
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

	const parentCallback = (data) => {
		setDate(data);
	}

	//fetch shifts
	const set_table = () => {
		//var newDate = new Date(oldDate.toDateString());
		let date_utc = null;
		if (date) { date_utc = new Date(date.toDateString()); }
		getShifts({ org_id,date:date_utc,active }).then((data) => {
			setShiftsState(data);
			setIsLoading(false);
		});	
		showOrg(org_id).then((data) => {
			setOrgState(data);
		});
	};

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

	//handle filter employee
	function compare(a, b) {
  		if (a.name < b.name) {
  			return -1;
  		}
  		if (a.name > b.name) {
  			return 1;
  		}
  		return 0;
	}
	let filteredShifts = null;
	if (!isLoading) {
		filteredShifts = shiftsState.filter((el) => {
		let shiftLowercase = el.name.toLowerCase();
		let searchTermLowercase = searchEmployeeState.toLowerCase();
		return shiftLowercase.indexOf(searchTermLowercase) > -1;
	});
	}

	//Display table shift list - consider creating a new component called shiftTable
	let shiftList = null;
	if (!isLoading && user_id) {
		shiftList = filteredShifts.sort(compare).map((el, index) => (
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
										{Number(user_id) ===
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
										{Number(user_id) ===
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
										{Number(user_id) ===
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
							))
	}

	//Load shifts
	useEffect(() => {
		set_table();
	}, [active, date]);

	return (
		<>
			<div className='col-12 col-md-11 m-auto'>
				<h2 className='my-5 text-center'>
					{orgState.name}
				</h2>
				<div className=" col mx-auto my-3 p-3 bg-light text-center d-flex flex-column">
					<div>
				<h5>Which employees should be displayed?</h5>
				 <Stack className="col-10 col-md-5 col-lg-3 mx-auto my-3 text-center" direction="row" spacing={2} alignItems="center">
        <Typography>Inactive only</Typography>
        <AntSwitch onChange={handleSwitchChange} checked={active} inputProps={{ 'aria-label': 'ant design' }} />
        <Typography>Active Only</Typography>
						</Stack></div>
					<div className="col-8 col-md-6 col-lg-4 m-auto">
					<Form.Group className="mb-3 " controlId="formBasicPassword">
            <Form.Label>Search employee</Form.Label>
               <Form.Control type="text" placeholder="Enter name" onChange={(e) => setSearchEmployeeState(e.target.value)} />
					   	</Form.Group>
						<div className="">
							<Form.Label>Click to search by date</Form.Label>
							<Datepicker parentCallback={parentCallback}/>
						</div>
					</div>
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
									<th key={index} onClick={()=>{}}>
										{th}
									</th>
								)
							)}
						</tr>
					</thead>
					<tbody>
						{shiftList}						
					</tbody>
				</Table>
			</div>
		</>
	);
}

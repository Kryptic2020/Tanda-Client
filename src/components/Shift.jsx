import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button, Table, Modal } from 'react-bootstrap';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import TextField from '@mui/material/TextField';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
//import TimePicker from '@mui/lab/TimePicker';
import MobileTimePicker from '@mui/lab/MobileTimePicker';
import { useGlobalState } from '../utils/stateContext';

export default function Shift() {
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
	const [startDate, setStartDate] = useState(new Date());
	const [value, setValue] = React.useState(null);
	const { store } = useGlobalState();
  const { loggedInUser } = store;
   const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  
  	const modal = (<Modal show={show} onHide={handleClose} animation={false}>
        <Modal.Header closeButton>
          <Modal.Title>Modal heading</Modal.Title>
        </Modal.Header>
        <Modal.Body>Woohoo, you're reading this text in a modal!</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleClose}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>)

	return (
		<>
			<div className='col-12 col-md-11 m-auto'>
				<h2 className='my-5 text-center'>
					Burger King's{' '}
				</h2>
				<div className='d-flex justify-content-between'>
					<h5 className="px-3">Shifts</h5>
					<Link className="px-3" to='/dashboard'>Back</Link>
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
						<tr>
							<td>1</td>
							{Array.from({
								length: 8,
							}).map((_, index) => (
								<td key={index}>
									Table cell {index}
								</td>
							))}
						</tr>
						<tr>
							<td>2</td>
							{Array.from({
								length: 8,
							}).map((_, index) => (
								<td key={index}>
									Table cell {index}
								</td>
							))}
						</tr>
						<tr>
							<td>3</td>
							{Array.from({
								length: 8,
							}).map((_, index) => (
								<td key={index}>
									Table cell {index}
								</td>
							))}
						</tr>
					</tbody>
				</Table>
			</div>
			<LocalizationProvider
				dateAdapter={AdapterDateFns}
      >
        <h3 className="text-center rounded p-5 m-0">Enter shift</h3>
        {modal}
				<div className='rounded mb-5 mx-auto py-5 py-lg-1 d-flex flex-wrap col-12 col-md-8 col-lg-11 bg-light text-center row'>
					<div className='row col-10 col-lg-2 p-0 my-2 mx-auto'>
						{' '}
            <input
              className='bg-light border height'
							value='Edson'
							readOnly
						></input>
					</div>

					<div className=' row col-10 col-lg-2 p-0 my-2 mx-auto'>
						<DatePicker
							className='bg-light border height'
							dateFormat='dd/MM/yyyy'
							selected={startDate}
							onChange={(date) =>
								setStartDate(date)
							}
						/>
					</div>
					<div className='row col-10 col-lg-2 p-0 my-2 mx-auto'>
            <MobileTimePicker
							label='Start Time'
							value={value}
							onChange={(newValue) => {
								setValue(newValue);
							}}
							renderInput={(params) => (
								<TextField {...params} />
							)}
						/>
					</div>
					<div className='row col-10 col-lg-2 p-0 my-2 mx-auto'>
						<MobileTimePicker
							label='Finish Time'
							value={value}
							onChange={(newValue) => {
								setValue(newValue);
							}}
							renderInput={(params) => (
								<TextField {...params} />
							)}
						/>
					</div>

					<Button
						className='btn btn-lg col-10 col-lg-2 my-2 mx-auto b-height row'
						onClick={handleShow}
						variant='secondary'
					>
						Enter break
					</Button>
					<Button className='btn btn-lg col-10 col-lg-1 my-5 my-lg-2 mx-auto b-height row'>
						Submit
					</Button>
				</div>
			</LocalizationProvider>
		</>
	);
}

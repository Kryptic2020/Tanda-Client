import React, { useState, useEffect } from 'react';
import DeleteIcon from '@mui/icons-material/Delete';
import { Button } from 'react-bootstrap';
import {
	showShift,
	updateBreak,
} from '../services/shiftServices';

export default function BreakForm({ shift, close_modal }) {
	
	//State management
	const [breakState, setBreakState] = useState(null);
	const [shiftState, setShiftState] = useState({});

  // Delete a single break value
	const deleteElement = (index) => {
		let newArray = shiftState.break;
		newArray.splice(index, 1);
		updateBreak({
			shift_id: shiftState.id,
			break: newArray,
		}).then(() => {
			showShift(shiftState.id).then((data) => {
				setShiftState(data);
				console.log(data.break);
			});
		});
	};
  
	//handle user input
	const handleChange = (e) => {
		setBreakState(Number(e.target.value));
	};

	//handle submit add a single break value
	const handleSubmit = () => {
		let breakArray = [];
		breakArray = shiftState.break;
		breakArray.push(breakState);
		updateBreak({
			shift_id: shiftState.id,
			break: breakArray,
		}).then(() => {
			setBreakState(null);
			showShift(shiftState.id).then((data) => {
				setShiftState(data);
				console.log(data.break);
				
			});
		});
		
	};
  
	// Load breaks from the selected shift 
	useEffect(() => {
		showShift(shift.id).then((data) =>
			setShiftState(data)
		);
	}, []);
	return (
		<div>
				<h3 className='text-center rounded my-5'>
				Add or Remove Breaks
			</h3>

			<div className='rounded mb-5 mx-auto py-5  d-flex flex-wrap col-12 col-md-6 col-lg-3 bg-light text-center row'>					
			<ol>
				{shiftState.break &&
					shiftState.break.map((el, index) => (
						<div key={index} className='row col-9 col-md-9 col-lg-8 p-0 my-2 mx-auto'><li>
							<input
								className='p-2 my-2 w-75 rounded'
								value={el}
							/>
							<DeleteIcon
								className='text-secondary w-25'
								onClick={() =>
									deleteElement(index)
								}
							/>
					
						</li>
						</div>
					))}
				</ol>
				<div className='row col-8 col-md-9 col-lg-8 p-0 my-4 mx-auto d-flex'>
			<input value={breakState} className="p-2 my-0 mx-0 col-5 rounded" type='number' onChange={handleChange} />
			<Button
				className='col h-100 btn btn-sm my-auto mx-4'
						onClick={handleSubmit}
						disabled={!breakState}
			>
				Add
					</Button>
				</div>
      <div className='row col-8 col-md-9 col-lg-8 p-0 my-1 mx-auto d-flex'>
      <Button variant="secondary w-100 mx-auto"
				className='btn btn-sm m-3'
				onClick={close_modal}
			>
				Close
					</Button>
					</div>
				</div>
		</div>
	);
}

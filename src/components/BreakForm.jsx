import React, { useState, useEffect } from 'react';
import DeleteIcon from '@mui/icons-material/Delete';
import { Button } from 'react-bootstrap';
import {
	showShift,
	updateBreak,
} from '../services/shiftServices';

export default function BreakForm({ shift ,close_modal}) {
	const [breakState, setBreakState] = useState(null);
	const [breaksState, setBreaksState] = useState([]);
	const [shiftState, setShiftState] = useState({});

	const deleteElement = (index) => {
		let newArray = shiftState.break;
		newArray.splice(index, 1);
		updateBreak({
			id: shiftState.id,
			break: newArray,
		}).then(() => {
			showShift(shiftState.id).then((data) => {
				setShiftState(data);
				console.log(data.break);
			});
		});
	};

	const handleChange = (e) => {
		setBreakState(Number(e.target.value));
	};

	const handleSubmit = () => {
		let breakArray = [];
		breakArray = shiftState.break;
		breakArray.push(breakState);
		updateBreak({
			id: shiftState.id,
			break: breakArray,
		}).then(() => {
			showShift(shiftState.id).then((data) => {
				setShiftState(data);
				console.log(data.break);
			});
		});
	};

	useEffect(() => {
		showShift(shift.id).then((data) =>
			setShiftState(data)
		);
	}, []);
	return (
		<div>
			<ol>
				{shiftState.break &&
					shiftState.break.map((el, index) => (
						<li key={index}>
							<input
								className='p-2 m-2'
								value={el}
							/>
							<DeleteIcon
								className='text-secondary'
								onClick={() =>
									deleteElement(index)
								}
							/>
						</li>
					))}
			</ol>
			<input type='number' onChange={handleChange} />
			<Button
				className='btn btn-sm mx-3'
				onClick={handleSubmit}
			>
				Add
			</Button>

      <Button variant="secondary"
				className='btn btn-sm m-5'
				onClick={close_modal}
			>
				Close
			</Button>
		</div>
	);
}

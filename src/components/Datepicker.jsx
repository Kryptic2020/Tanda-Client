import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

export default function Datepicker({parentCallback}) {
	const [dateState, setDateState] = useState();
	return (
		
			<DatePicker
      name='dateState'
      autoComplete="off"
				className='bg-light border height'
				dateFormat='dd/MM/yyyy'
				selected={dateState}
      onChange={(data) => { setDateState(data); parentCallback(data)}}
			/>
	);
}

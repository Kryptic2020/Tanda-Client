//shift table headings
export const table_heading = [
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
export function sumBreak(data) {
	let result = null;
	if (data && data.length > 1) {
		result = data.reduce((a, b) => a + b);
	} else {
		result = data;
	}
	return result;
}

//convert time formats
export function convertTime(data) {
	let time =
		new Date(data).getHours() +
		':' +
		((new Date(data).getMinutes() < 10 ? '0' : '') +
			new Date(data).getMinutes());
	return time;
}

//convert date formats
export function convertDate(date) {
	return new Date(date).toLocaleDateString('es-ES', {
		year: 'numeric',
		month: 'numeric',
		day: 'numeric',
	});
}

//work hours calculations
export function getWorkedHours(start, finish, coffee) {
	let day = 0;
	if (finish < start) {
		day = 1000 * 60 * 60 * 24;
	}
	const end =
		(new Date(finish).getTime() + day) / (1000 * 60);
	const init = new Date(start).getTime() / (1000 * 60);
	const result = end - init - sumBreak(coffee);
	return (Math.round(result) / 60).toFixed(2);
}

//calculate overnight shift
export function getOvernight(start, finish, coffee) {
	let day = 1000 * 60 * 60 * 24;
	let result = 0;
	if (finish < start) {
		const end =
			(new Date(finish).getTime() + day) /
			(1000 * 60);
		const init =
			new Date(start).getTime() / (1000 * 60);
		result = (
			Math.round(end - init - sumBreak(coffee)) / 60
		).toFixed(2);
	}
	return result;
}

//calculate sunday overtime
export function penaltyTimeCalc(start) {
	const time =
		new Date(start).getMinutes() +
		new Date(start).getHours() * 60;
	const day = 60 * 24;
	return day - time;
}

//check if date is sunday
export function isSunday(date) {
	if (new Date(date).getDay() === 0) {
		return true;
	} else {
		return false;
	}
}
export function isSaturday(date) {
	if (new Date(date).getDay() === 6) {
		return true;
	} else {
		return false;
	}
}

//calculate shift cost
export function shiftCost(
	date,
	start,
	finish,
	coffee,
	rate
) {
	let cost = 0;
	if (isSunday(date)) {
		if (getOvernight(start, finish, coffee) === 0) {
			cost =
				getWorkedHours(start, finish, coffee) *
				rate *
				2;
		} else {
			const regular =
				getOvernight(start, finish, coffee) -
				penaltyTimeCalc(start);
			if (regular < 0) {
				cost =
					(penaltyTimeCalc(start) - regular) *
					rate *
					2;
			} else {
				cost =
					(penaltyTimeCalc(start) * 2 + regular) *
					rate;
			}
		}
	} else if (isSaturday(date)) {
		if (getOvernight(start, finish, coffee) === 0) {
			cost =
				getWorkedHours(start, finish, coffee) *
				rate;
		} else {
			const regular =
				getOvernight(start, finish, coffee) -
				penaltyTimeCalc(start);
			if (regular < 0) {
				cost =
					(penaltyTimeCalc(start) - regular) *
					rate;
			} else {
				cost =
					(penaltyTimeCalc(start) + regular * 2) *
					rate;
			}
		}
	} else {
		cost = getWorkedHours(start, finish, coffee) * rate;
	}
	return cost;
}

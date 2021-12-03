import tandaAPI from '../config/tanda_api'

export async function getShifts(data) {
  const response = await tandaAPI.post('/api/shift/shifts', data)
	return response.data
}

// export async function activeShifts(data) {
//   const response = await tandaAPI.get(`/api/shift/active/${data}`)
// 	return response.data
// }
// export async function inactiveShifts(data) {
//   const response = await tandaAPI.get(`/api/shift/inactive/${data}`)
// 	return response.data
// }

export async function newShift(data) {
  const response = await tandaAPI.post('/api/shift/new', data)
	return response.data
}

export async function updateShift(data) {
  const response = await tandaAPI.put('/api/shift/update', data)
	return response.data
}

export async function deleteShift(data) {
  const response = await tandaAPI.delete(`/api/shift/${data}`)
	return response.data
}

export async function showShift(data) {
  const response = await tandaAPI.get(`/api/shift/show/${data}`)
	return response.data
}

export async function updateBreak(data) {
  const response = await tandaAPI.put('/api/shift/break/update', data)
	return response.data
}
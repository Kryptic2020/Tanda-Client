import tandaAPI from '../config/tanda_api'

export async function shifts(data) {
  const response = await tandaAPI.get(`/api/shift/${data}`)
	return response.data
}

export async function newShift(data) {
  const response = await tandaAPI.post('/api/shift/new', data)
	return response.data
}
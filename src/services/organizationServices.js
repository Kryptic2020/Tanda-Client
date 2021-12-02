import tandaAPI from '../config/tanda_api'

export async function newOrg(data) {
	const response = await tandaAPI.post('/api/organization/new', data)	
	return response.data
}

export async function getOrgs() {
	const response = await tandaAPI.get('/api/organization/get')	
	return response.data
}

export async function getJoinedOrgs(data) {
	const response = await tandaAPI.post('/api/organization/joined', data)
	return response.data
}

export async function showOrg(data) {
	const response = await tandaAPI.get(`/api/organization/view/${data}`)	
	return response.data
}

export async function updateOrg(data) {
	const response = await tandaAPI.put('/api/organization', data)	
	return response.data
}

export async function destroyOrg(data) {
	const response = await tandaAPI.delete(`/api/organization/${data}`)	
	return response.data
}

export async function joinOrg(data) {
	const response = await tandaAPI.post('/api/organization/join', data)	
	return response.data
}

export async function leaveOrg(data) {
	const response = await tandaAPI.delete(`/api/organization/leave/${data}`)	
	return response.data
}
import tandaAPI from '../config/tanda_api'

export async function signUp(data) {
	const response = await tandaAPI.post('/api/auth/sign-up', data)	
	return response.data
}
export async function signIn(data) {
	const response = await tandaAPI.post('/api/auth/sign-in', data)
	return response.data
}
export async function signOut() {
	sessionStorage.clear();
	return "Logged out"
}
export async function forgotPass(data) {
	const response = await tandaAPI.post('/api/auth/forgot-pass', data)
	console.log(response.data)
	return response.data
}
export async function resetPass(data) {
	const response = await tandaAPI.post('/api/auth/reset-pass', data)	
	return response.data
}
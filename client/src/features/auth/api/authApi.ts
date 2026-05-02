import { apiFetch } from '../../../services/apiClient'

export type RegisterPayload = {
	full_name: string
	email: string
	password: string
}

export type LoginResponse = {
	access_token: string
	token_type: string
	user_id: number
	email: string
	full_name: string
	role: 'CITIZEN' | 'ADMIN'
}

export type RegisterResponse = {
	id: number
	full_name: string
	email: string
	role: 'CITIZEN' | 'ADMIN'
}

export async function registerUser(payload: RegisterPayload) {
	return apiFetch<RegisterResponse>('/auth/register', {
		method: 'POST',
		body: JSON.stringify(payload),
		skipAuth: true,
	})
}

export async function loginUser(email: string, password: string) {
	const body = new URLSearchParams()
	body.set('username', email)
	body.set('password', password)

	return apiFetch<LoginResponse>('/auth/login', {
		method: 'POST',
		body,
		skipAuth: true,
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded',
		},
	})
}

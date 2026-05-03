const API_BASE_URL =
	import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api/v1'

const AUTH_TOKEN_STORAGE_KEY = 'varna-cityfix-access-token'

type ApiFetchOptions = RequestInit & {
	skipAuth?: boolean
}

export async function apiFetch<T>(
	path: string,
	options: ApiFetchOptions = {},
): Promise<T> {
	const { skipAuth = false, headers, ...rest } = options

	const token = localStorage.getItem(AUTH_TOKEN_STORAGE_KEY)
	const finalHeaders = new Headers(headers)

	if (!finalHeaders.has('Content-Type') && !(rest.body instanceof FormData)) {
		finalHeaders.set('Content-Type', 'application/json')
	}

	if (!skipAuth && token) {
		finalHeaders.set('Authorization', `Bearer ${token}`)
	}

	const response = await fetch(`${API_BASE_URL}${path}`, {
		...rest,
		headers: finalHeaders,
	})

	if (!response.ok) {
		let errorMessage = 'Request failed'

		try {
			const errorData = await response.json()
			errorMessage = errorData.detail || errorMessage
		} catch {
			errorMessage = response.statusText || errorMessage
		}

		throw new Error(errorMessage)
	}

	if (response.status === 204) {
		return undefined as T
	}

	return response.json() as Promise<T>
}

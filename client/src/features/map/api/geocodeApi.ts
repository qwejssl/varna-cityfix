import { apiFetch } from '../../../services/apiClient'

export type GeocodeResponse = {
	lat: number
	lon: number
	display_name: string
}

export function geocodeAddress(address: string) {
	const params = new URLSearchParams({ address })
	return apiFetch<GeocodeResponse>(`/geocode?${params.toString()}`, {
		method: 'GET',
		skipAuth: true,
	})
}

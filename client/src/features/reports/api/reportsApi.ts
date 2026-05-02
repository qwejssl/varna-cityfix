import { apiFetch } from '../../../services/apiClient'
import type {
	CreateReportPayload,
	Report,
	UpdateReportPayload,
} from '../types/report'

export function getReports() {
	return apiFetch<Report[]>('/reports/')
}

export function getMyReports() {
	return apiFetch<Report[]>('/reports/my')
}

export function getReportById(id: number) {
	return apiFetch<Report>(`/reports/${id}`)
}

export function createReport(payload: CreateReportPayload) {
	return apiFetch<Report>('/reports/', {
		method: 'POST',
		body: JSON.stringify(payload),
	})
}

export function updateReport(id: number, payload: UpdateReportPayload) {
	return apiFetch<Report>(`/reports/${id}`, {
		method: 'PUT',
		body: JSON.stringify(payload),
	})
}

export function deleteReport(id: number) {
	return apiFetch<void>(`/reports/${id}`, {
		method: 'DELETE',
	})
}

export async function uploadReportImage(file: File, token: string) {
	const formData = new FormData()
	formData.append('file', file)

	const response = await fetch(
		'http://127.0.0.1:8000/api/v1/reports/upload-image',
		{
			method: 'POST',
			headers: {
				Authorization: `Bearer ${token}`,
			},
			body: formData,
		},
	)

	if (!response.ok) {
		let message = 'Failed to upload image'
		try {
			const errorData = await response.json()
			message = errorData.detail || message
		} catch {
			//
		}
		throw new Error(message)
	}

	return response.json() as Promise<{ image_url: string; uploaded_by: number }>
}

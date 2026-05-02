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

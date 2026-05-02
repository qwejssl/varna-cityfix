import { useEffect, useState } from 'react'
import { getMyReports } from '../api/reportsApi'
import type { Report } from '../types/report'

export function useMyReports() {
	const [reports, setReports] = useState<Report[]>([])
	const [isLoading, setIsLoading] = useState(true)
	const [error, setError] = useState<string | null>(null)

	useEffect(() => {
		const loadReports = async () => {
			try {
				setIsLoading(true)
				setError(null)
				const data = await getMyReports()
				setReports(data)
			} catch (err) {
				const message =
					err instanceof Error ? err.message : 'Failed to load my reports'
				setError(message)
			} finally {
				setIsLoading(false)
			}
		}

		loadReports()
	}, [])

	return {
		reports,
		isLoading,
		error,
	}
}

import { useEffect, useState } from 'react'
import { getReports } from '../../reports/api/reportsApi'
import type { Report } from '../../reports/types/report'

export function useAdminReports() {
	const [reports, setReports] = useState<Report[]>([])
	const [isLoading, setIsLoading] = useState(true)
	const [error, setError] = useState<string | null>(null)

	useEffect(() => {
		const loadReports = async () => {
			try {
				setIsLoading(true)
				setError(null)
				const data = await getReports()
				setReports(data)
			} catch (err) {
				const message =
					err instanceof Error ? err.message : 'Failed to load admin reports'
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

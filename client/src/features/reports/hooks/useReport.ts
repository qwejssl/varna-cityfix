import { useEffect, useState } from 'react'
import { getReportById } from '../api/reportsApi'
import type { Report } from '../types/report'

export function useReport(id: number | undefined) {
	const [report, setReport] = useState<Report | null>(null)
	const [isLoading, setIsLoading] = useState(true)
	const [error, setError] = useState<string | null>(null)

	useEffect(() => {
		if (!id) return

		const loadReport = async () => {
			try {
				setIsLoading(true)
				setError(null)
				const data = await getReportById(id)
				setReport(data)
			} catch (err) {
				const message =
					err instanceof Error ? err.message : 'Failed to load report'
				setError(message)
			} finally {
				setIsLoading(false)
			}
		}

		loadReport()
	}, [id])

	return { report, isLoading, error }
}

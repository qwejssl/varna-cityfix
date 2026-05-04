import { useMemo } from 'react'
import { useReports } from '../../reports/hooks/useReports'
import type { Report, ReportStatus } from '../../reports/types/report'
import ReportsMap from '../components/ReportsMap'

const ACTIVE_STATUSES: ReportStatus[] = ['NEW', 'UNDER_REVIEW', 'IN_PROGRESS']

function isActive(report: Report) {
	return ACTIVE_STATUSES.includes(report.status)
}

export default function CityMapPage() {
	const { reports, isLoading, error } = useReports()

	const activeReports = useMemo(() => reports.filter(isActive), [reports])

	return (
		<section className='page-section'>
			<div className='page-hero page-hero-compact'>
				<div>
					<span className='section-kicker'>City overview</span>
					<h1>City Map</h1>
					<p className='page-hero-text'>
						Explore active urban issues in Varna on the interactive map. Only
						reports that are still in progress are shown here.
					</p>
				</div>
			</div>

			{isLoading && <p>Loading map data...</p>}
			{error && <p className='error-text'>{error}</p>}

			{!isLoading && !error && activeReports.length > 0 && (
				<>
					<ReportsMap reports={activeReports} />

					<section className='map-report-slider-wrap'>
						<div className='map-report-slider'>
							{activeReports.map(report => (
								<article key={report.id} className='map-report-card'>
									<header className='map-report-card-header'>
										<span
											className={`status-badge status-${report.status.toLowerCase()}`}
										>
											{report.status}
										</span>
										<span className='map-report-id'>#{report.id}</span>
									</header>

									<h3 className='map-report-title'>{report.title}</h3>

									<p className='map-report-description'>{report.description}</p>

									<ul className='map-report-meta'>
										<li>
											<strong>Category:</strong> {report.category}
										</li>
										<li>
											<strong>District:</strong> {report.district}
										</li>
										<li>
											<strong>Address:</strong> {report.address}
										</li>
									</ul>
								</article>
							))}
						</div>
					</section>
				</>
			)}

			{!isLoading && !error && activeReports.length === 0 && (
				<div className='placeholder-box'>
					No active reports on the map right now. Submit a new issue or check
					your previous reports in the dashboard.
				</div>
			)}
		</section>
	)
}

import { useReports } from '../../reports/hooks/useReports'
import ReportsMap from '../components/ReportsMap'

export default function CityMapPage() {
	const { reports, isLoading, error } = useReports()

	return (
		<section className='page-section'>
			<h1>City Map</h1>
			<p>
				Explore all reported urban issues in Varna on the interactive map below.
			</p>

			{isLoading && <p>Loading map data...</p>}
			{error && <p className='error-text'>{error}</p>}

			{!isLoading && !error && reports.length > 0 && (
				<ReportsMap reports={reports} />
			)}

			{!isLoading && !error && reports.length === 0 && (
				<div className='placeholder-box'>
					No reports found. Create the first issue report to see markers on the
					map.
				</div>
			)}

			{!isLoading && !error && reports.length > 0 && (
				<div className='reports-section'>
					<h2>Reported Issues</h2>

					<div className='reports-grid'>
						{reports.map(report => (
							<article key={report.id} className='report-card'>
								<h3>{report.title}</h3>
								<p>{report.description}</p>
								<ul className='report-meta'>
									<li>
										<strong>Status:</strong> {report.status}
									</li>
									<li>
										<strong>Category:</strong> {report.category}
									</li>
									<li>
										<strong>District:</strong> {report.district}
									</li>
									<li>
										<strong>Address:</strong> {report.address}
									</li>
									<li>
										<strong>Coordinates:</strong> {report.latitude},{' '}
										{report.longitude}
									</li>
								</ul>
							</article>
						))}
					</div>
				</div>
			)}
		</section>
	)
}
